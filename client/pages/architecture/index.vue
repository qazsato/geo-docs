<template>
  <Page>
    <template #header>
      <Header :title="title" />
    </template>
    <article class="markdown-body">
      <h2>システム構成図</h2>
      <img src="~/assets/images/geo_aws.png" height="500px" />
      <h2>データベース構成</h2>
      <p><a href="https://docs.geo.qazsato.com/database" target="_blank">DB 定義書</a>を参照ください。</p>
      <h2>リポジトリ構成</h2>
      <p>Geo サービスは 4 つのリポジトリで構成されています。</p>

      <table>
        <thead>
          <tr>
            <th>リポジトリ</th>
            <th>概要</th>
            <th>言語 / FW</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>geo-data</td>
            <td>GIS オープンデータを DB に登録するためのコンバーター</td>
            <td>Bash, PostgreSQL 12.6, PostGIS 3.0</td>
          </tr>
          <tr>
            <td>geo-api</td>
            <td>住所や統計情報を元にした GIS 分析をおこなうための REST API</td>
            <td>Ruby 3.0, Rails 6.1</td>
          </tr>
          <tr>
            <td>geo-tool</td>
            <td>地図可視化ツール</td>
            <td>JavaScript, Nuxt.js</td>
          </tr>
          <tr>
            <td>geo-docs</td>
            <td>Geo API の仕様書及び参照実装</td>
            <td>JavaScript, Nuxt.js</td>
          </tr>
        </tbody>
      </table>
    </article>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      title: 'システム構成',
    }
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style lang="scss" scoped>
.markdown-body {
  font-size: 14px;
}
</style>
