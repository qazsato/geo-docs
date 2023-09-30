<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
header {
  padding: 0 60px 0 20px;
}

main {
  padding: 20px;
}
</style>
