<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" active="/addresses/about" />
    </template>
    <section>
      <h2>住所データについて</h2>
      <p>
        Geo
        APIで扱う住所データは、<b>3段階の住所レベル</b>に区分されており、下記のデータ階層となっています。
      </p>
      <el-table :data="addressTableData" style="width: 100%;">
        <el-table-column
          prop="level"
          label="レベル"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="レベル名"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="コード桁数"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="example"
          label="出力例 (code, name)"
        ></el-table-column>
      </el-table>
    </section>
    <section>
      <h2>住所ポリゴンデータについて</h2>
      <p>
        住所ポリゴンデータは、住所データと同様に3段階の住所レベルに区分されており、住所データとは<b>一対一の関係</b>となっています。<br />
        また出力形式は、空間データの標準的なフォーマットの GeoJSON
        に加えて、より軽量なフォーマットである TopoJSON にも対応しています。
      </p>
      <el-table :data="geoAddressTableData" style="width: 100%;">
        <el-table-column
          prop="level"
          label="レベル"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="レベル名"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="コード桁数"
          width="110"
        ></el-table-column>
        <el-table-column prop="example" label="出力例">
          <template slot-scope="scope">
            <a :href="scope.row.example.url" target="_blank">{{
              scope.row.example.name
            }}</a>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section>
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
    </section>
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
      addressTableData: [
        {
          level: 1,
          name: '都道府県',
          code: '2桁',
          example: '13, 東京都',
        },
        {
          level: 2,
          name: '市区町村',
          code: '5桁',
          example: '13101, 東京都千代田区',
        },
        {
          level: 3,
          name: '町丁・字等',
          code: '11桁',
          example: '13101001001, 東京都千代田区丸の内１丁目',
        },
      ],
      geoAddressTableData: [
        {
          level: 1,
          name: '都道府県',
          code: '2桁',
          example: {
            url:
              'https://gist.github.com/qazsato/f3da1ff9377c91fb0096955279b2827a',
            name: '東京都のポリゴンデータ',
          },
        },
        {
          level: 2,
          name: '市区町村',
          code: '5桁',
          example: {
            url:
              'https://gist.github.com/qazsato/dd594ab00779ff19b737c8c72b1099b6',
            name: '東京都千代田区のポリゴンデータ',
          },
        },
        {
          level: 3,
          name: '町丁・字等',
          code: '11桁',
          example: {
            url:
              'https://gist.github.com/qazsato/84a1c676f539b3340d4572a1c67cca3b',
            name: '東京都千代田区丸の内１丁目',
          },
        },
      ],
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
section {
  margin-bottom: 50px;
}

h2 {
  font-size: 20px;
  font-weight: 400;
  color: #1f2f3d;
}

li,
p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}

li {
  margin: 5px 0;
}

p {
  margin: 14px 0;
}
</style>
