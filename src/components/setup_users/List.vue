<template>  
    <div v-if="$parent.permissions.action_0" v-show="$system_variables.status_data_loaded==1">
      <a-card :class="'d-print-none'">
        <router-link :to="'/'+$parent.controler_url+'/add'" :class="'ant-btn ant-btn-primary ant-btn-md mr-2 mb-2'">{{$system_functions.get_label('button_new')}}</router-link>  
        <a-button type="primary" :class="'mr-2 mb-2'" v-if="$parent.permissions.action_4" onclick="window.print();">{{$system_functions.get_label('button_print')}}</a-button>
        <a-button type="primary" :class="'mr-2 mb-2'" v-if="$parent.permissions.action_0" @click="$parent.init">{{$system_functions.get_label('button_refresh')}}</a-button>
      </a-card>
      <a-card>
        <a-table :columns="$parent.columns.display_columns" :data-source="modifiedItems" bordered :pagination="$parent.pagination" :class="'hasactionColumnFirst'" :scroll="{x:true}">
          <div slot="filter_name_en" style="padding: 8px">
            <a-input v-model="$parent.columns.filter_columns.name_en"/>
          </div>
          <div slot="filter_id" style="padding: 8px">
            <a-row>
              <a-col>From</a-col>
              <a-col><a-input v-model="$parent.columns.filter_columns.id_from"/></a-col>
            </a-row>
            <a-row>
              <a-col>To</a-col>
              <a-col><a-input v-model="$parent.columns.filter_columns.id_to"/></a-col>
            </a-row>
            
          </div>
          <div slot="filter_name_bn" style="padding: 8px">
            <a-input v-model="$parent.columns.filter_columns.name_bn"/>
          </div>
          <div slot="filter_mobile_no" style="padding: 8px">
            <a-input v-model="$parent.columns.filter_columns.mobile_no"/>
          </div>
          <div slot="filter_email" style="padding: 8px">
            <a-input v-model="$parent.columns.filter_columns.email"/>
          </div>
          <div slot="filter_status" style="padding: 8px">
            <select class="ant-input" v-model="$parent.columns.filter_columns.status">
              <option value="">Select</option>
              <option value="Active">Active</option>
              <option value="In-Active">In-Active</option>                    
            </select>
          </div>
          <a-icon slot="searchIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }"/>
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
  data() {
    return {
      
    };
  },
  computed:{   
    modifiedItems:function(){ 
      return this.$parent.items.filter((item)=>{
        var filter=this.$parent.columns.filter_columns.name_en;
        if((filter.length>0) && (item.name_en.toLowerCase().indexOf(filter.toLowerCase())==-1) )                 
        {
          return false;
        }
        filter=this.$parent.columns.filter_columns.name_bn;
        if((filter.length>0) && (item.name_bn.toLowerCase().indexOf(filter.toLowerCase())==-1) )                 
        {
          return false;
        }
        filter=this.$parent.columns.filter_columns.mobile_no;
        if((filter.length>0) && (item.mobile_no.toLowerCase().indexOf(filter.toLowerCase())==-1) )                 
        {
          return false;
        }
        filter=this.$parent.columns.filter_columns.email;
        if((filter.length>0) && (item.email.toLowerCase().indexOf(filter.toLowerCase())==-1) )                 
        {
          return false;
        }
        filter=this.$parent.columns.filter_columns.status;        
        if((filter.length>0) && (item.status!=filter))                 
        {
          return false;
        }
        filter=this.$parent.columns.filter_columns.id_from;        
        if((filter.length>0) &&(filter>0)&& (item.id<filter))                 
        {
          return false;
        }
        filter=this.$parent.columns.filter_columns.id_to;        
        if((filter.length>0) &&(filter>0)&& (item.id>filter))                 
        {
          return false;
        }
        return true;
      });    
      //return this.$parent.items;
    },
    
  },  
  mounted:function()
  {      
  }, 
  methods:{        
  } 
}
</script>
