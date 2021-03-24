<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" />
    </template>
    <article class="markdown-body">
      <h2>AWS 構成</h2>
      <img src="~/assets/images/geo_aws.png" height="500px" />
      <h2>Database 構成</h2>
      <p>
        SchemaSpy によって生成された<a href="https://docs.geo.qazsato.com/database" target="_blank">ドキュメント</a
        >を参照ください。
      </p>
      <h2>GitHub 構成</h2>
      <p>Geo サービスは 4 つのリポジトリで構成されています。</p>
      <ul>
        <li>
          <span>geo-data</span>
          <ul>
            <li>国の GIS オープンデータを DB に登録するためのコンバータ。</li>
            <li>主に bash, JavaScript で実装。</li>
          </ul>
        </li>
        <li>
          <span>geo-api</span>
          <ul>
            <li>住所や統計情報を元にした GIS 分析をおこなうための JSON API。</li>
            <li>Rails で実装。</li>
          </ul>
        </li>
        <li>
          <span>geo-tool</span>
          <ul>
            <li>地図可視化ツール。</li>
            <li>Nuxt で実装。</li>
          </ul>
        </li>
        <li>
          <span>geo-docs</span>
          <ul>
            <li>Geo API の仕様書・ドキュメント。</li>
            <li>Nuxt で実装。</li>
          </ul>
        </li>
      </ul>
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
