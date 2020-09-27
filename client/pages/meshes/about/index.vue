<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/meshes/about" />
    </template>
    <section>
      <article class="markdown-body">
        <h2>地域メッシュとは</h2>
        <p>
          地域メッシュとは、緯度・経度に基づき地域を隙間なく網の目（メッシュ）に分けたものです。<br />
          メッシュを識別するためのコードを<b>地域メッシュコード</b>と言い、<b>4桁から11桁の数字で構成</b>されています。<br />
          なお、地域メッシュは日本独自の概念であり、JIS 規格で定められています。
        </p>
        <h2>地域メッシュデータ</h2>
        <p>
          Geo Docs で扱う地域メッシュデータは、JIS
          規格に基づいており、<b>6段階の地域メッシュレベル</b>まで対応しています。<br />
          データ階層は下記の通りです。
        </p>
        <table>
          <thead>
            <tr>
              <th>レベル</th>
              <th>区画の種類</th>
              <th>コード桁数</th>
              <th>一辺の長さ</th>
              <th>出力例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>第１次地域区画</td>
              <td>4桁</td>
              <td>約80km</td>
              <td>
                <a href="https://gist.github.com/qazsato/fb26be6de0ecbefd107d7c1eff35cc5e" target="_blank"
                  >5339のポリゴンデータ</a
                >
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>第２次地域区画</td>
              <td>6桁</td>
              <td>約10km</td>
              <td>
                <a href="https://gist.github.com/qazsato/027f8dca59b2895d1040adc7e8621cc4" target="_blank"
                  >533945のポリゴンデータ</a
                >
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>基準地域メッシュ(第３次地域区画)</td>
              <td>8桁</td>
              <td>約1km</td>
              <td>
                <a href="https://gist.github.com/qazsato/d9f219ba60e2d5193a8c1d65bce39fed" target="_blank"
                  >53394529のポリゴンデータ</a
                >
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>２分の１地域メッシュ</td>
              <td>9桁</td>
              <td>約500m</td>
              <td>
                <a href="https://gist.github.com/qazsato/bd3fe7aa7fbff441fd543a92814692b5" target="_blank"
                  >533945292のポリゴンデータ</a
                >
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>４分の１地域メッシュ</td>
              <td>10桁</td>
              <td>約250m</td>
              <td>
                <a href="https://gist.github.com/qazsato/557430aaf0504f558b5cc45fcbe257b0" target="_blank"
                  >5339452922のポリゴンデータ</a
                >
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>８分の１地域メッシュ</td>
              <td>11桁</td>
              <td>約125m</td>
              <td>
                <a href="https://gist.github.com/qazsato/443642c41a6b074d7ec2bf3d5204bb56" target="_blank"
                  >53394529221のポリゴンデータ</a
                >
              </td>
            </tr>
          </tbody>
        </table>

        <h2>地域メッシュの実装</h2>
        <p>
          Geo Docs の地域メッシュの機能は、npm モジュールの
          <b>japanmesh</b> を用いて実装されています。<br />
          <a href="https://www.npmjs.com/package/japanmesh" target="_blank">https://www.npmjs.com/package/japanmesh</a>
        </p>
        <h2>参考</h2>
        <ul>
          <li>
            <a href="http://www.stat.go.jp/data/mesh/gaiyou.html" target="_blank"
              >地域メッシュ統計の概要 - 総務省統計局</a
            >
          </li>
        </ul>
      </article>
    </section>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      title: '地域メッシュについて',
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
