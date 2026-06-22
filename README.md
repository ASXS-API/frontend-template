# frontend-template

内部后台前端的「典范」基线 —— 一致的外壳、设计语言与工程约定,供新项目派生参考。

从 **AMP-Manager** 沉淀、经 **ASXSDashboard** 验证后抽取的最小内核。

- 前端代码与完整说明在 [`web/`](./web/README.md)。
- 技术栈:Vite 6 · React 19 · TypeScript · Tailwind · shadcn/ui · motion · recharts。

```bash
cd web && npm install && npm run dev
```

派生新项目:拷走 `web/` → 改 `web/src/config.ts` 的 `BRAND_NAME` → 删示例页(`Overview` / `Settings` / `api/demo.ts`)→ 填业务。

详见 [`web/README.md`](./web/README.md) 的「内核 vs 业务」「核心约定」「加一个新页面」三节。
