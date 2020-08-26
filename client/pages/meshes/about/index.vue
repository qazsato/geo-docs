<template>
  <Page>
    <template v-slot:header>
      <Header :title="title" />
    </template>
    <section>
      <article class="markdown-body">
        <h2>地域メッシュデータ</h2>
        <p>
          Geo APIで扱う地域メッシュデータは、JIS
          規格に定められている仕様に基づき作成しており、<b>5段階の地域メッシュレベル</b>まで対応しています。<br />
          データ階層は下記の通りです。
        </p>
        <table>
          <tr>
            <th>レベル</th>
            <th>レベル名</th>
            <th>コード桁数</th>
            <th>一辺の長さ</th>
            <th>出力例</th>
          </tr>
          <tr>
            <td>1</td>
            <td>第１次地域区画</td>
            <td>4桁</td>
            <td>約80km</td>
            <td>
              <a
                href="https://gist.github.com/qazsato/fb26be6de0ecbefd107d7c1eff35cc5e"
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
              <a
                href="https://gist.github.com/qazsato/027f8dca59b2895d1040adc7e8621cc4"
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
              <a
                href="https://gist.github.com/qazsato/d9f219ba60e2d5193a8c1d65bce39fed"
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
              <a
                href="https://gist.github.com/qazsato/bd3fe7aa7fbff441fd543a92814692b5"
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
              <a
                href="https://gist.github.com/qazsato/557430aaf0504f558b5cc45fcbe257b0"
                >5339452922のポリゴンデータ</a
              >
            </td>
          </tr>
        </table>
      </article>
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

<style lang="scss" scoped>
.markdown-body {
  font-size: 14px;
}
</style>
