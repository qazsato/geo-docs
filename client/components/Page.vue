<template>
  <el-container>
    <el-header height="90px">
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>
