# 互動式 AI 故事體驗遊戲 POC

一個前後端分離的概念驗證專案，展示了 AI 故事生成與玩家進度制互動的體驗流程。玩家可選擇主題、篇幅並於每一步輸入行動，由後端模擬 AI 引擎生成後續劇情段落。

## 專案結構

```
├── backend        # Node.js + Express 故事引擎 API
│   └── src        # /api/start、/api/next、/api/state 等路由
├── frontend       # Vue 3 + Vite + TypeScript 前端介面
│   └── src
│       ├── components  # UI 元件、動畫、打字效果
│       └── stores       # Pinia 遊戲狀態管理
└── README.md
```

## 特色與功能

- **進度制互動**：玩家每次輸入行動或選擇 A/B/C 選項，後端依據主題與上下文生成下一段劇情並更新進度。
- **多主題體驗**：支援武俠冒險、偵探推理、末日生存、青春校園等風格化敘事。
- **沉浸式 UI/UX**：深色霧光視覺、TailwindCSS 設計、`@motionone/vue` 動畫，以及段落打字效果。
- **即時狀態查詢**：內建 `GET /api/state/:sessionId` 方便前端同步遊戲進度。
- **可調篇幅**：短、中、長篇對應不同段落上限，方便測試故事節奏。

## 安裝與啟動

依序在 `backend` 與 `frontend` 資料夾內安裝相依套件並啟動服務：

```bash
# Backend (預設使用 port 5001)
cd backend
npm install
npm run start

# Frontend (新的終端分頁)
cd ../frontend
npm install
npm run dev
```

若後端服務開啟於非預設的 `http://localhost:5001`，請於前端建立 `.env` 檔案設定 `VITE_API_BASE_URL`：

```bash
VITE_API_BASE_URL=http://localhost:5001
```

Vite 開發伺服器啟動後於瀏覽器瀏覽 `http://localhost:5173`。

## API 快速預覽

- `POST /api/start`：建立新故事，回傳 `sessionId` 與初始段落。
- `POST /api/next`：提交玩家輸入，回傳更新後的故事狀態。
- `GET /api/state/:sessionId`：查詢既有故事當前進度。

所有狀態儲存於記憶體 `Map` 中，適合作為 POC 或展示用途。若需擴充，可改用永久儲存層或串接實際 LLM 服務。

## 後續延伸想法

1. 串接真實的 LLM（例如 OpenAI API）以提供更豐富、分歧性更高的敘事。
2. 將 in-memory 狀態改為持久化（Redis / 資料庫）以支援多人同時測試。
3. 加入分支地圖或故事回顧模式，讓玩家可視覺化比較不同選擇。

---

歡迎依照需求自訂劇情模板或 UI 風格，讓展示更貼近最終體驗！
