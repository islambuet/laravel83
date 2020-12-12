<template>  
    <div v-if="$parent.permissions.action_0" v-show="$system_variables.status_data_loaded==1">
      <a-card :class="'d-print-none'">
        <router-link :to="'/'+$parent.controler_url+'/add'" :class="'ant-btn ant-btn-primary ant-btn-md mr-2 mb-2'">{{$system_functions.get_label('button_new')}}</router-link>  
        <a-button type="primary" :class="'mr-2 mb-2'" v-if="$parent.permissions.action_4" onclick="window.print();">{{$system_functions.get_label('button_print')}}</a-button>
        <a-button type="primary" :class="'mr-2 mb-2'" v-if="$parent.permissions.action_0" @click="$parent.init">{{$system_functions.get_label('button_refresh')}}</a-button>
      </a-card>
      <a-card>
        <a-table :columns="$parent.columns.display_columns" :data-source="modifiedItems" bordered :pagination="$parent.pagination" :class="'hasactionColumnFirst'" :scroll="{x:true}">
          <template slot="action" slot-scope="text, record">
            <router-link :to="'/'+$parent.controler_url+'/edit/'+record.id" :class="'text-primary'" >
              <a-tooltip placement="top">
                <template slot="title">
                  <span>Edit</span>
                </template>
                <a-icon type="edit" theme="filled" :style="{  color: '#00ff00' }"/>
              </a-tooltip>            
            </router-link>            
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
      return this.$parent.items;
    },
    
  },  
  mounted:function()
  {      
  }, 
  methods:{        
  } 
}
</script>
