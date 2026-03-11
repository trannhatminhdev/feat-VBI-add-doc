#!/usr/bin/env python3
"""
VSeed HTML 生成脚本
基于模板文件生成可运行的图表 HTML

使用方法：
    python generate_html.py --title "图表标题" --schema '{"chartType":"column",...}' --output "output.html"
    
    # 显式指定模板路径
    python generate_html.py --template /path/to/generate.html --title "标题" --schema '...' --output out.html
"""

import argparse
import json
import re
import sys
import os
from pathlib import Path


def get_script_dir():
    """获取脚本所在目录"""
    return Path(__file__).parent.resolve()


def find_template_file():
    """
    自动查找模板文件，支持以下相对路径：
    1. ../assets/template/generate.html（标准路径）
    
    返回找到的模板路径，或 None
    """
    script_dir = get_script_dir()
    
    # 候选路径列表（按优先级）
    candidates = [
        script_dir.parent / "assets" / "template" / "generate.html",
    ]
    
    for path in candidates:
        if path.exists():
            return path
    
    return None


def load_template(template_path=None):
    """
    加载 HTML 模板
    
    Args:
        template_path: 显式指定的模板路径（可选）
    
    Returns:
        模板内容字符串
    """
    if template_path:
        # 使用显式指定的路径
        path = Path(template_path)
        if not path.exists():
            print(f"❌ 指定的模板文件不存在: {template_path}", file=sys.stderr)
            sys.exit(1)
    else:
        # 自动查找模板
        path = find_template_file()
        if not path:
            script_dir = get_script_dir()
            print("❌ 模板文件未找到，已尝试以下路径：", file=sys.stderr)
            print(f"   - {script_dir.parent / 'assets' / 'template' / 'generate.html'}", file=sys.stderr)
            print("\n请使用 --template 参数显式指定模板路径", file=sys.stderr)
            sys.exit(1)
    
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def load_schema(schema_source):
    """
    加载 schema，支持多种来源：
    - JSON 文件路径
    - JSON 字符串
    - stdin 输入
    """
    if schema_source:
        # 尝试作为文件路径
        if os.path.isfile(schema_source):
            try:
                with open(schema_source, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError as e:
                print(f"❌ JSON 文件格式错误: {e}", file=sys.stderr)
                sys.exit(1)
        # 尝试作为 JSON 字符串解析
        try:
            return json.loads(schema_source)
        except json.JSONDecodeError:
            print(f"❌ 无法解析 schema（既不是有效文件也不是合法JSON）", file=sys.stderr)
            print(f"   输入前100字符: {schema_source[:100]}...", file=sys.stderr)
            sys.exit(1)
    
    # 从 stdin 读取
    if not sys.stdin.isatty():
        stdin_data = sys.stdin.read().strip()
        if stdin_data:
            try:
                return json.loads(stdin_data)
            except json.JSONDecodeError as e:
                print(f"❌ stdin JSON 格式错误: {e}", file=sys.stderr)
                sys.exit(1)
    
    print("❌ 未提供 schema，请通过 --schema 参数或 stdin 传入", file=sys.stderr)
    sys.exit(1)


def load_theme(theme_source):
    """
    加载主题配置（可选），支持：
    - JSON 文件路径
    - JSON 字符串
    
    Returns:
        主题配置对象（dict）或 None
    """
    if not theme_source:
        return None
    
    # 尝试作为文件路径
    if os.path.isfile(theme_source):
        try:
            with open(theme_source, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ 主题 JSON 文件格式错误: {e}", file=sys.stderr)
            sys.exit(1)
    
    # 尝试作为 JSON 字符串解析
    try:
        return json.loads(theme_source)
    except json.JSONDecodeError:
        print(f"❌ 无法解析 theme（既不是有效文件也不是合法JSON）", file=sys.stderr)
        print(f"   输入前100字符: {theme_source[:100]}...", file=sys.stderr)
        sys.exit(1)


def format_schema_js(schema):
    """将 schema 格式化为 JavaScript 代码"""
    schema_json = json.dumps(schema, ensure_ascii=False, indent=2)
    return f"const schema = {schema_json};"


def format_theme_js(theme):
    """将主题配置格式化为 JavaScript 代码
    
    兜底处理：未传入 theme 时返回空对象，确保模板不报错
    """
    if not theme:
        return "const customThemeConfig = {};"
    theme_json = json.dumps(theme, ensure_ascii=False, indent=2)
    return f"const customThemeConfig = {theme_json};"


def generate_html(template_content, title, description, schema, theme=None, chart_height=None):
    """生成 HTML 内容
    
    Args:
        template_content: 模板内容
        title: 图表标题
        description: 图表描述
        schema: 图表配置
        theme: 主题配置（可选）
        chart_height: 图表容器高度（可选，如 "600px" 或 600）
    """
    schema_js = format_schema_js(schema)
    theme_js = format_theme_js(theme)
    
    # 替换占位符
    html = template_content.replace("{{title}}", title)
    html = html.replace("{{description}}", description)
    html = html.replace("{{schema}}", schema_js)
    html = html.replace("{{custom_theme_config}}", theme_js)
    
    # 替换图表高度（如果指定）
    if chart_height:
        # 支持纯数字或带单位的字符串
        if isinstance(chart_height, (int, float)) or chart_height.isdigit():
            height_value = f"{int(chart_height)}px"
        else:
            height_value = chart_height
        
        # 替换 .chart-container 的 height
        html = re.sub(
            r'(\.chart-container\s*\{[^}]*height:\s*)(\d+px)',
            rf'\g<1>{height_value}',
            html
        )
    
    return html


def main():
    parser = argparse.ArgumentParser(
        description="VSeed HTML 生成工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例：
  # 自动查找模板
  python generate_html.py --title "销售报表" --schema '{"chartType":"column",...}' --output report.html
  
  # 显式指定模板路径
  python generate_html.py --template /path/to/generate.html --title "报表" --schema '...' -o out.html
  
  # 自定义图表高度
  python generate_html.py --title "报表" --chart-height 600 --schema '...' -o out.html
        """
    )
    
    parser.add_argument("--template", "-T", help="模板文件路径（可选，不指定则自动查找）")
    parser.add_argument("--title", "-t", required=True, help="【必填】图表标题")
    parser.add_argument("--description", "-d", default="", help="图表描述")
    parser.add_argument("--schema", "-s", help="Schema JSON（文件路径或JSON字符串）")
    parser.add_argument("--theme", help="主题配置 JSON（文件路径或JSON字符串，可选）")
    parser.add_argument("--chart-height", "-H", help="图表容器高度（如 600 或 '600px'）")
    parser.add_argument("--output", "-o", help="输出文件路径（不指定则输出到stdout）")
    
    args = parser.parse_args()
    
    # 加载模板
    template_content = load_template(args.template)
    
    # 加载 schema
    schema = load_schema(args.schema)
    
    # 加载主题（可选）
    theme = load_theme(args.theme) if args.theme else None
    
    # 生成 HTML
    html = generate_html(
        template_content, 
        args.title, 
        args.description, 
        schema,
        theme=theme,
        chart_height=getattr(args, 'chart_height', None)
    )
    
    # 输出
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✅ 已生成: {output_path}", file=sys.stderr)
    else:
        print(html)


if __name__ == "__main__":
    main()
