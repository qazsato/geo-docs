<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" />
    </template>
    <article class="markdown-body">
      <h2>住所データ</h2>
      <p>
        Geo
        APIで扱う住所データは、<b>3段階の住所レベル</b>に区分されており、下記のデータ階層となっています。
      </p>
      <table>
        <tr>
          <th>レベル</th>
          <th>分類</th>
          <th>コード桁数</th>
          <th>出力例 (code, name)</th>
        </tr>
        <tr>
          <td>1</td>
          <td>都道府県</td>
          <td>2桁</td>
          <td>13, 東京都</td>
        </tr>
        <tr>
          <td>2</td>
          <td>市区町村</td>
          <td>5桁</td>
          <td>13101, 東京都千代田区</td>
        </tr>
        <tr>
          <td>3</td>
          <td>町丁・字等</td>
          <td>11桁</td>
          <td>13101001001, 東京都千代田区丸の内１丁目</td>
        </tr>
      </table>
      <h2>住所ポリゴンデータ</h2>
      <p>
        住所ポリゴンデータは、住所データと同様に3段階の住所レベルに区分されており、住所データとは<b>一対一の関係</b>となっています。<br />
        また出力形式は、空間データの標準的なフォーマットの GeoJSON
        に加えて、より軽量なフォーマットである TopoJSON にも対応しています。
      </p>
      <table>
        <tr>
          <th>レベル</th>
          <th>分類</th>
          <th>コード桁数</th>
          <th>出力例</th>
        </tr>
        <tr>
          <td>1</td>
          <td>都道府県</td>
          <td>2桁</td>
          <td>
            <a
              href="https://gist.github.com/qazsato/f3da1ff9377c91fb0096955279b2827a"
              >東京都のポリゴンデータ</a
            >
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>市区町村</td>
          <td>5桁</td>
          <td>
            <a
              href="https://gist.github.com/qazsato/dd594ab00779ff19b737c8c72b1099b6"
              >東京都千代田区のポリゴンデータ</a
            >
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>町丁・字等</td>
          <td>11桁</td>
          <td>
            <a
              href="https://gist.github.com/qazsato/84a1c676f539b3340d4572a1c67cca3b"
              >東京都千代田区丸の内１丁目のポリゴンデータ</a
            >
          </td>
        </tr>
      </table>
      <h2>出典</h2>
      <ul>
        <li>
          国土交通省国土数値情報ダウンロードサイト（<a
            href="https://nlftp.mlit.go.jp/index.html"
            target="_blank"
            >https://nlftp.mlit.go.jp/index.html</a
          >）
        </li>
        <ul>
          <li>
            「国土数値情報 行政区域データ,
            位置参照情報」（国土交通省）を加工して作成
          </li>
        </ul>
        <li>
          政府統計の総合窓口(e-Stat)（<a
            href="https://www.e-stat.go.jp/"
            target="_blank"
            >https://www.e-stat.go.jp/</a
          >）
        </li>
        <ul>
          <li>
            「国勢調査」（総務省）を加工して作成
          </li>
        </ul>
      </ul>
    </article>
  </Page>
</template>

<script>
import Page from '@/components/Page'
import Header from '@/components/Header'

export default {
  components: {
    Page,
    Header,
  },

  data() {
    return {
      title: '住所について',
    }
  },

  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style scoped>
.markdown-body {
  font-size: 14px;
}
</style>
