<template>
  <div>
    <vue-good-table
      :line-numbers='true'
      :columns='columns'
      :rows='rows'
      :groupOptions="{enabled: true}"
    />
    <template slot="table-header-row" slot-scope="props">
      <span v-if="props.column.field === 'diet'">
        <button class="fancy-btn">Action</button>
      </span>
      <span v-else>
        {{props.formattedRow[props.column.field]}}
      </span>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'my-component',
    data() {
      return {
        columns: [
          {
            label: 'Name',
            field: 'name'
          },
          {
            label: 'diet',
            field: 'diet'
          },
          {
            label: 'count',
            field: 'count',
            type: 'number' // 'percentage'
          }
        ],
        rows: [
          {
            mode: 'span', // span means this header will span all columns
            label: 'Mammal', // this is the label that'll be used for the header
            html: false, // if this is true, label will be rendered as html
            children: [
              { name: 'Elephant', diet: 'herbivore', count: 5 },
              { name: 'Cat', diet: 'carnivore', count: 28 }
            ]
          },
          {
            mode: 'span', // span means this header will span all columns
            label: 'Reptiles', // this is the label that'll be used for the header
            html: false, // if this is true, label will be rendered as html
            children: [
              { name: 'Snake', diet: 'herbivore', count: 5 },
              { name: 'lizard', diet: 'carnivore', count: 28 }
            ]
          },
          {
            mode: 'span', // span means this header will span all columns
            label: 'Fish', // this is the label that'll be used for the header
            html: false, // if this is true, label will be rendered as html
            children: [
              { name: 'Shark', diet: 'herbivore', count: 5 },
              { name: 'koi', diet: 'carnivore', count: 28 }
            ]
          },
          {
            name: 'Mammals Total', // this is the label that'll be used for the header
            diet: undefined,
            count: '', // total count will be displayed here
            children: [
              { name: 'Elephant', diet: 'herbivore', count: 5 },
              { name: 'Cat', diet: 'carnivore', count: 28 }
            ]
          }
        ]
      }
    },
    methods: {
      rowStyleClassFn(row) {
        return row.age > 18 ? 'green' : 'red';
      }
    }
  };
</script>
