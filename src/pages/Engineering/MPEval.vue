<template>
  <div class="home">
    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition" style="width: 100%;">
      <div class="hidden-columns">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="el-table__header-wrapper">
        <table class="el-table__header" style="width: 1116px;" border="0" cellspacing="0" cellpadding="0">
          <colgroup>
            <col width="180" name="el-table_1_column_1">
            <col width="234" name="el-table_1_column_2">
            <col width="234" name="el-table_1_column_3">
            <col width="234" name="el-table_1_column_4">
            <col width="234" name="el-table_1_column_5">
            <col width="0" name="gutter">
          </colgroup>
          <thead class="has-gutter">
          <tr>
            <th class="el-table_1_column_1     is-leaf" rowspan="1" colspan="1">
              <div class="cell">ID</div>
            </th>
            <th class="el-table_1_column_2     is-leaf" rowspan="1" colspan="1">
              <div class="cell">姓名</div>
            </th>
            <th class="el-table_1_column_3     is-leaf is-sortable" rowspan="1" colspan="1">
              <div class="cell">数值 1<span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span></div>
            </th>
            <th class="el-table_1_column_4     is-leaf is-sortable" rowspan="1" colspan="1">
              <div class="cell">数值 2<span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span></div>
            </th>
            <th class="el-table_1_column_5     is-leaf is-sortable" rowspan="1" colspan="1">
              <div class="cell">数值 3<span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span></div>
            </th>
            <th class="gutter" style="width: 0px; display: none;"></th>
          </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper is-scrolling-none">
        <table class="el-table__body" style="width: 1116px;" border="0" cellspacing="0" cellpadding="0">
          <colgroup>
            <col width="180" name="el-table_1_column_1">
            <col width="234" name="el-table_1_column_2">
            <col width="234" name="el-table_1_column_3">
            <col width="234" name="el-table_1_column_4">
            <col width="234" name="el-table_1_column_5">
          </colgroup>
          <tbody>
          <tr class="el-table__row">
            <td class="el-table_1_column_1  " rowspan="1" colspan="5">
              <div class="cell">129871222222</div>
            </td>
            <td class="el-table_1_column_3  " rowspan="1" colspan="1">
              <div class="cell">234</div>
            </td>
            <td class="el-table_1_column_4  " rowspan="1" colspan="1">
              <div class="cell">3.2</div>
            </td>
            <td class="el-table_1_column_5  " rowspan="1" colspan="1">
              <div class="cell">10</div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td class="el-table_1_column_1  " rowspan="1" colspan="5">
              <div class="cell">12987123</div>
            </td>
            <td class="el-table_1_column_3  " rowspan="1" colspan="1">
              <div class="cell">165</div>
            </td>
            <td class="el-table_1_column_4  " rowspan="1" colspan="1">
              <div class="cell">4.43</div>
            </td>
            <td class="el-table_1_column_5  " rowspan="1" colspan="1">
              <div class="cell">12</div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td class="el-table_1_column_1  " rowspan="1" colspan="5">
              <div class="cell">12987124</div>
            </td>
            <td class="el-table_1_column_3  " rowspan="1" colspan="1">
              <div class="cell">324</div>
            </td>
            <td class="el-table_1_column_4  " rowspan="1" colspan="1">
              <div class="cell">1.9</div>
            </td>
            <td class="el-table_1_column_5  " rowspan="1" colspan="1">
              <div class="cell">9</div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td class="el-table_1_column_1  " rowspan="1" colspan="5">
              <div class="cell">12987125</div>
            </td>
            <td class="el-table_1_column_3  " rowspan="1" colspan="1">
              <div class="cell">621</div>
            </td>
            <td class="el-table_1_column_4  " rowspan="1" colspan="1">
              <div class="cell">2.2</div>
            </td>
            <td class="el-table_1_column_5  " rowspan="1" colspan="1">
              <div class="cell">17</div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td class="el-table_1_column_1  " rowspan="1" colspan="5">
              <div class="cell">12987126</div>
            </td>
            <td class="el-table_1_column_3  " rowspan="1" colspan="1">
              <div class="cell">539</div>
            </td>
            <td class="el-table_1_column_4  " rowspan="1" colspan="1">
              <div class="cell">4.1</div>
            </td>
            <td class="el-table_1_column_5  " rowspan="1" colspan="1">
              <div class="cell">15</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="el-table__column-resize-proxy" style="display: none;"></div>
    </div>
  </div>
</template>
<script>
  export default {

  }
</script>
<style lang="scss" scoped>
  .el-table .el-table__header .cell {height: 40px; min-height: 40px;line-height: 40px;}
  .el-table td, .el-table th {
    padding: 2px 0;

    min-width: 0px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
  }

  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: normal;
    word-break: break-all;
    line-height: 10px;
  }

</style>
