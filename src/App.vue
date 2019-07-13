<template>
  <div id="app">
    <div id="nav">
      <span>
广州一体化空间三维信息平台
      </span>
    
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
html, body{
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
}
#nav {
    position: absolute;
    z-index: 100000;
    width: 100%;
    background-color: #508DCA;
    height: 50px;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
    text-align: left;
    display: none;
    span {
      margin-left: 10px;
    }
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
