<template>  
    <div v-if="$parent.permissions.action_0" v-show="$system_variables.status_data_loaded==1">
      <a-card :class="'d-print-none'">
        <router-link to="/sys_module_task/add" :class="'ant-btn ant-btn-primary ant-btn-md mr-2 mb-2'">{{$system_functions.get_label('button_new')}}</router-link>  
        <a-button type="primary" :class="'mr-2 mb-2'" v-if="$parent.permissions.action_4" onclick="window.print();">{{$system_functions.get_label('button_print')}}</a-button>
        <a-button type="primary" :class="'mr-2 mb-2'" v-if="$parent.permissions.action_0" @click="$parent.init">{{$system_functions.get_label('button_refresh')}}</a-button>
      </a-card>
      <a-card>
        <a-table :columns="$parent.columns.display_columns" :data-source="modifiedItems" bordered :pagination="false" :class="'hasactionColumnFirst'">
          <template slot="action" slot-scope="text, record">
            <router-link :to="'/sys_module_task/edit/'+record.id" :class="'text-primary'" ><a-icon type="edit" theme="filled" :style="{  color: '#00ff00' }"/></router-link>
          </template>
        </a-table>    
      </a-card>
  </div>
</template>

<script>
//import Filters from '@/views/template/Filters.vue'
//import Pagination from '@/views/template/Pagination.vue'


export default {
  name: 'List',
  components: {
    //Filters,Pagination   
  },
  data:function(){
    return{
      show_fitler_options:true      
    }
  },
  computed:{   
    modifiedItems:function(){       
      var items=[];
      for(var i=0;i<this.$parent.items.length;i++)
      {
        var item={};
        item.id=this.$parent.items[i].module_task.id;
        item['name_0']=this.$parent.items[i].module_task['name_'+((this.$system_variables.language=='en')?'bn':'en')]; 
        for(var level=1;level<=this.$parent.max_level;level++)
        {
          if(level==this.$parent.items[i].level)
          {
            //item['name_'+this.$system_variables.language+level]=this.$parent.items[i].module_task['name_'+this.$system_variables.language];          
            item['name_'+level]=this.$parent.items[i].module_task['name_'+this.$system_variables.language];          
          }
          else
          { 
            item['name_'+level]='';   
          }
        }
        items.push(item);
      }
      
      return items;
      
      /*var temp_items=[];  
      for(var i=0;i<this.$parent.items.length;i++)
      {
        var item={};
        item.id=this.$parent.items[i].module_task.id;
        for(var level=1;level<=this.$parent.max_level;level++)
        {
          if(level==this.$parent.items[i].level)
          {
            //item['name_'+this.$system_variables.language+level]=this.$parent.items[i].module_task['name_'+this.$system_variables.language];          
            item['name_'+this.$system_variables.language+level]=this.$parent.items[i].module_task['name_en'];          
          }
          else
          { 
            item['name_'+this.$system_variables.language+level]='';   
          }
          
        }
        item.type=this.$parent.items[i].module_task.type;
        item.controller=this.$parent.items[i].module_task.controller;
        item.ordering=this.$parent.items[i].module_task.ordering;
        item.date_created=this.$parent.items[i].module_task.date_created;
        temp_items.push(item);
      } 
      var filterd_items=this.$system_functions.get_filter_items(temp_items,this.$parent.columns.filter_columns);          
      return filterd_items;*/
    },          
    get_csv_headers(){
      return this.$parent.columns.display_columns.filter((item)=>{ if(item.key=='actions'){return false;} return true});
    }
  },  
  mounted:function()
  {      
  }, 
  methods:{    
    onTableChange(pagination, filters, sorter) 
    {
      console.log('params', pagination, filters, sorter);    
      
    },
  } 
}
</script>
