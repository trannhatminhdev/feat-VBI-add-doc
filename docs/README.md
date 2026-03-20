# docs

本目录存放仓库级设计、目标、ADR 与执行计划。

## 组织方式

- 一个主题一个目录：`YYYY-MM-DD-topic/`
- 目录内文件按需创建：`goal.md`、`adr.md`、`plan.md`
- 跨 package / 跨 practice 的主题放在这里
- 单个 package 或 practice 的专题文档放到各自的 `docs/` 下

## 示例

```text
docs/
├── README.md
└── 2026-03-19-measure-format/
    ├── adr.md
    └── plan.md
```
