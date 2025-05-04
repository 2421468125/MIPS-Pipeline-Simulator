# MIPS-Pipeline-Simulator

这是一款非常简易的MIPS五阶段CPU流水线模拟器，提供最基础的R、I、J类指令

有部分指令暂时不支持，如jr，ret等 ，~~因为支持函数调用的解释器太麻烦了~~<br/>

本项目提供简单的Vue前端界面可视化流水线、寄存器与内存，支持数据定向(forwarding)与分支预测(branch prediction)，可以单步执行、跳转到断点。

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```
