<template>
  <el-container>
    <el-header>
      <Header :title="title" active="/meshes/about" />
    </el-header>
    <el-main>
      <section>
        <h2>地域メッシュデータについて</h2>
        <p>
          Geo APIで扱う地域メッシュデータは、JIS
          規格に定められている仕様に基づき作成されており、<b>5段階の地域メッシュレベル</b>まで対応しています。データ階層は下記の通りです。
        </p>
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column
            prop="level"
            label="レベル"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="レベル名"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="code"
            label="コード桁数"
            width="110"
          ></el-table-column>
          <el-table-column
            prop="distance"
            label="一辺の長さ"
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
    </el-main>
  </el-container>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: {
    Header,
  },

  data() {
    return {
      title: '地域メッシュについて',
      tableData: [
        {
          level: 1,
          name: '第１次地域区画',
          code: '4桁',
          distance: '約80km',
          example: {
            url:
              'https://gist.github.com/qazsato/fb26be6de0ecbefd107d7c1eff35cc5e',
            name: '5339のポリゴンデータ',
          },
        },
        {
          level: 2,
          name: '第２次地域区画',
          code: '6桁',
          distance: '約10km',
          example: {
            url:
              'https://gist.github.com/qazsato/027f8dca59b2895d1040adc7e8621cc4',
            name: '533945のポリゴンデータ',
          },
        },
        {
          level: 3,
          name: '基準地域メッシュ(第３次地域区画)',
          code: '8桁',
          distance: '約1km',
          example: {
            url:
              'https://gist.github.com/qazsato/d9f219ba60e2d5193a8c1d65bce39fed',
            name: '53394529のポリゴンデータ',
          },
        },
        {
          level: 4,
          name: '２分の１地域メッシュ',
          code: '9桁',
          distance: '約500m',
          example: {
            url:
              'https://gist.github.com/qazsato/bd3fe7aa7fbff441fd543a92814692b5',
            name: '533945292のポリゴンデータ',
          },
        },
        {
          level: 5,
          name: '４分の１地域メッシュ',
          code: '10桁',
          distance: '約250m',
          example: {
            url:
              'https://gist.github.com/qazsato/557430aaf0504f558b5cc45fcbe257b0',
            name: '5339452922のポリゴンデータ',
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

p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
  margin: 14px 0;
}
</style>
