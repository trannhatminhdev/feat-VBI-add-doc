# 通用工作流程：配置查询与 HTML 输出

本文件提取了三种场景共享的标准流程，避免在每个 workflow 中重复定义。

---

## 一、配置项查找流程

所有配置项查询遵循统一的三步模式。之所以设计成"两个文件都必须读"的流程，是因为 `type-details` 定义数据结构（字段名、类型、嵌套），而 `rules` 定义业务约束（取值范围、组合限制、数据要求）。只看结构会漏掉约束导致验证失败，只看约束又不知道字段层级。

```
1. top-keys/{chartType}.json  → 获取配置项名称和 componentName
2. type-details/{ComponentName}.md → 结构定义（字段名、类型、嵌套关系）
3. rules/{ComponentName}.md → 业务约束（取值范围、必填条件、组合规则）
```

**为什么不能跳过这个流程**：VSeed 的配置项结构经常与直觉不同（比如 `xAxis.title` 是对象而非字符串，`dataset` 是纯数组而非带 id 的对象），凭记忆生成是错误的主要来源。

**查询示例**：

```
用户要给 column 图添加标签 →
  ① top-keys/column.json → label 的 componentName: "LabelSpec"
  ② type-details/LabelSpec.md → label 结构
  ③ rules/LabelSpec.md → label 约束（如果存在）
```

---

## 二、核心 Schema 约束

这些约束是每次生成/编辑/诊断都要遵守的底线规则，违反会导致 `zVSeed.safeParse` 报错。

### 必要字段

| 字段         | 类型                        | 要求                                             |
| ------------ | --------------------------- | ------------------------------------------------ |
| `chartType`  | `string`                    | 第一个字段，值必须来自 `chart-type-guide.md`     |
| `dataset`    | `Array<Object>`             | 纯数组，禁止包装成 `{id, name, data}` 对象       |
| `dimensions` | `Array<{id, encoding?, …}>` | `id` 必须与 dataset 字段名完全一致（大小写敏感） |
| `measures`   | `Array<{id, encoding?, …}>` | 同上                                             |
| `theme`      | `string`（可选）            | 只写主题名，主题对象通过 `--theme` 脚本参数传入  |

### 典型报错速查

| 报错片段                                | 原因                 | 修复                                      |
| --------------------------------------- | -------------------- | ----------------------------------------- |
| `No matching discriminator` / chartType | chartType 缺失或非法 | 补充合法 chartType                        |
| `expected: "string"` / path: ["theme"]  | theme 写成对象       | 改为字符串主题名                          |
| `expected: "object"`                    | 嵌套字段写成字符串   | 检查 type-details，title/label 通常是对象 |

---

## 三、输出 HTML 标准流程

每次生成/编辑/诊断的最终产物都是可运行 HTML，使用统一脚本。

### 脚本调用

```bash
python <SKILL_DIR>/scripts/generate_html.py \
  --template <SKILL_DIR>/assets/template/generate.html \
  --title "[标题]" \
  --description "[描述]" \
  --schema '[完整 schema JSON]' \
  --output "[文件名].html"
```

### 参数说明

| 参数                    | 必填 | 说明                                  |
| ----------------------- | ---- | ------------------------------------- |
| `--template` / `-T`     | ✅   | 模板文件路径                          |
| `--title` / `-t`        | ✅   | 图表标题                              |
| `--description` / `-d`  | ✅   | 图表描述                              |
| `--schema` / `-s`       | ✅   | Schema JSON 字符串或文件路径          |
| `--theme`               | ❌   | 主题配置 JSON（有配色需求时使用）     |
| `--chart-height` / `-H` | ❌   | 图表容器高度（默认 400px）            |
| `--output` / `-o`       | ❌   | 输出文件路径（不指定则输出到 stdout） |

### 关键要求

- 必须调用脚本，**不得手写 HTML 或只输出 JSON 片段**
- schema 必须包含 `chartType`（否则脚本直接报错）
- 有配色需求时，额外添加 `--theme` 参数（详见 `theme-config-guide.md`）
