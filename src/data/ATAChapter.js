import {formatDate} from 'src/utils/utils';
import score from 'src/components/Score/index';
import $ from 'jquery';

const POSITIVE = 0;
const NEGATIVE = 1;
export default {
  created () {
    //this.getATAChapterFormData();
    this.getATAChapterServerData();
  },
  data () {
    return {
      tableData: [],
      filters: {
        ATAChapterNumb:'',
        ATAChapterName:''
      },
      loading: false,
      pagesize: 10,
      currentpage: 1,
      total: 0
    }
  },
  methods: {
    getATAChapterServerData () {
      var sef = this;
      $.ajax({
        url: 'http://106.12.133.158:8080/queryACType',
        type: "POST",
        data: "{actype:'"+ sef.filters.ATAChapterNumb +"',acmake:'"+ sef.filters.ATAChapterName +"'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
          console.log(data.status === 0);
          if (data.status === 0) {
            sef.tableData = data.data;
            sef.total = sef.tableData.length;
            sef.loading = false;

            console.log(sef.tableData);
          } else {
            console.log(data.status);
          }
        },
        error: function (e) {
          console.log(e);
        }
      });
    },
    getATAChapterServerData222 () {
      this.axios.get(`getATAChapterServerData?per_page=${this.pagesize}&cur_page=${this.currentpage}`)
        .then(data => {
          if (data.errno === 0) {
            this.tableData = data.data.table;
            this.total = data.data.total;
            this.loading = false;
          } else {
            console.log(data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    show (scope) {
      console.log(scope);
    },
    handleSizeChange (value) {
      this.pagesize = value;
      this.getTableData();
    },
    handleCurrentChange (value) {
      this.currentpage = value;
      this.getTableData();
    },
    addRowClass ({row, rowIndex}) {
      if (row.rateType === NEGATIVE) {
        return 'warning-row';
      }
    },
    reset(){
      this.$refs["filters"].resetFields();
    }
  },
  filters: {
    rateTypeToText (rateType) {
      return rateType === POSITIVE ? '满意' : '不满意';
    },
    formatDate (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  components: {
    score
  }
};
