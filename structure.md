mips-pipeline-simulator/
├── public/
│ └── index.html # HTML 入口文件
├── src/
│ ├── assets/ # 静态资源 (CSS, 图片等)
│ │ └── main.css
│ ├── components/ # 可复用的 Vue 组件
│ │ ├── PipelineBlock.vue # 单个流水线阶段块的可视化组件
│ │ ├── PipelineStage.vue # 单个指令在流水线的可视化组件
│ │ ├── PipelineDisplay.vue # 整合所有指令在流水线阶段的显示区域
│ │ ├── RegisterFile.vue # 显示寄存器文件状态
│ │ ├── MemoryDisplay.vue # 显示内存状态
│ │ ├── InstructionInput.vue # 指令输入区域
│ │ ├── ControlPanel.vue # 控制按钮 (步进, 运行, 重置)
│ │ └── HazardInfo.vue # 显示冒险信息
│ ├── core/ # 核心模拟器逻辑 (纯 JavaScript/TypeScript)
│ │ ├── instructionParser.js # MIPS 指令解析器
│ │ └── pipeline.js # 流水线核心逻辑 (阶段、冒险处理)
│ ├── stores/ # Pinia 状态管理
│ │ ├── pipelineStore.js # 管理流水线状态 (PC, 各阶段指令, 冒险)
│ │ ├── registerStore.js # 管理寄存器状态
│ │ └── memoryStore.js # 管理内存状态
│ └── App.vue # 根组件，组织页面布局
│ main.js # 应用入口，初始化 Vue 和 Pinia
├── .gitignore
├── package.json # 项目依赖和脚本
├── README.md # 项目说明
└── vite.config.js # Vite 配置
