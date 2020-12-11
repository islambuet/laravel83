<template>
  <div v-if="$system_variables.status_task_loaded==1">
    <List v-if="method=='list'"/>    
    <AddEdit v-if="(method=='add') || (method=='edit')"/>        
  </div>
</template>

<script>
import List from './List.vue'
import AddEdit from './AddEdit.vue'
export default {
    name: 'SetupUsers',
    components: {
        List,AddEdit   
    },
    mounted:function()
    {
      this.$system_functions.load_task_languages([
            {language:this.$system_variables.language,file:'components/'+this.controler_url+'/language.js'},
        ]);
      this.init();        
    },
    data() {
      return {
        controler_url:'setup_users',
        method:'list',        
        permissions:{'action_0':0},
        columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]},
        items:[],
        types:[],
        item:{},  
        user_groups:[], 
        modules_tasks:{'max_level':1,'tree':[]}, 
        module_task_max_action:9,
        default_item:{id:0,name_en:"",name_bn:'',mobile_no:'',email:'',password:'',user_group_id:'',status:'Active',ordering:99},        
      }
    },
    watch: {
        $route(to, from) {
        this.routing(to);      
        }
    },
    methods:{
    routing:function(route)
    {
      this.getItems();//items should be initialized becuase its needed in others methods
      if(route.path==('/'+this.controler_url))
      {
        this.method='list';       
        //this.get_items();
      }
      else if(route.path==('/'+this.controler_url+'/add'))
      {
        this.method='add';
        this.addEdit(0);
      }
      //console.log(route);
      else if(route.path.indexOf('/'+this.controler_url+'/edit/')!=-1)
      {
        this.method='edit';        
        this.addEdit(route.params['item_id']);        
      }      
    },
    init:function()
    {
        this.$system_variables.status_task_loaded=0;  
        this.$system_variables.status_data_loaded=1;  
        this.reload_items=true;
        this.$axios.get(this.controler_url)
        .then(response=>{
            if(response.data.errorStr=='')        
            {
              this.permissions=response.data.permissions; 
              this.user_groups=response.data.user_groups; 
              this.setFilterColumns();
              this.setDisplayColumns();           
              this.$system_variables.status_task_loaded=1;
              this.routing(this.$route);
            }
            else
            {
                
            }        
        })
        .catch(error => {  
            this.alert_type = 'error';
            if(error.response && error.response.data && error.response.data.errorStr)
            {
                 this.$system_functions.responseErrorTask(error.response.data.errorStr);
            }
            {
              this.$system_variables.status_data_loaded = 1;
              this.$system_variables.status_task_loaded=-1;
            }           
            
        });
    },
    setFilterColumns:function()
    {
    },
    setDisplayColumns:function()
    {
      this.columns.display_columns=[];
      this.columns.display_columns.push({
        title: this.$system_functions.get_label('label_action'),
        key: 'action',
        scopedSlots: { customRender: 'action' },       
        width: 20,
      });
      this.columns.display_columns.push({
        title: this.$system_functions.get_label('label_id'),        
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,                    
        width: 20,
      });
      this.columns.display_columns.push({
        title: this.$system_functions.get_label('label_name_en'),        
        dataIndex: 'name_en',
        sorter: (a, b) => a.name_en.localeCompare(b.name_en),                    
        width: 100,
      });
      this.columns.display_columns.push({
        title: this.$system_functions.get_label('label_name_bn'),        
        dataIndex: 'name_bn', 
        sorter: (a, b) => a.name_bn.localeCompare(b.name_bn),                   
        width: 100,
      });    
      this.columns.display_columns.push({
        title: this.$system_functions.get_label_task('label_mobile_no'),        
        dataIndex: 'mobile_no',
        sorter: (a, b) => a.mobile_no.localeCompare(b.mobile_no),                    
        width: 50,
      });
      this.columns.display_columns.push({
        title: this.$system_functions.get_label_task('label_email'),        
        dataIndex: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),                    
        width: 100,
      });
      
      this.columns.display_columns.push({
        title: this.$system_functions.get_label('label_created_at'),        
        dataIndex: 'created_at', 
        sorter: (a, b) => a.name_bn.localeCompare(b.name_bn),                   
        width: 100,
      });   
      this.columns.display_columns.push({
        title: this.$system_functions.get_label('label_status'),        
        dataIndex: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),                        
        width: 100,
      });

    },
    getItems:function()
    {
      if(this.reload_items)
      {
        this.$system_variables.status_data_loaded=0;        
        this.$axios.get(this.controler_url+'/get_items')
        .then(response=>{          
        this.$system_variables.status_data_loaded=1;
            if(response.data.errorStr=='')
            {   
                this.items=response.data.items;                                                                           
                this.reload_items=false;
            }       
        })
        .catch(error => { 
            if(error.response && error.response.data && error.response.data.errorStr)
            {
                this.$system_functions.responseErrorTask(error.response.data.errorStr);
            }
            else
            {
              this.$system_functions.responseErrorTask();//default Error
            }
            
            this.$system_variables.status_data_loaded = 1;
        });
      }
    },
    addEdit:function(item_id)
    {
      if(item_id>0)
      {
        if(!(this.permissions.action_2))
        { 
          this.$system_variables.status_task_loaded=-2;
        }
        else
        {
          var item_found=false;
          for(var i=0;i<this.items.length;i++)
          {
            if(this.items[i].id==item_id)
            {
              //this.item={};
              Object.assign(this.item, this.items[i]);
              item_found=true;
              break;
            }
          }
          if(!item_found)
          {
            this.$router.push('/'+this.controler_url);            
          }
        }
      }
      else
      {
        if(!(this.permissions.action_1))
        {
          this.$system_variables.status_task_loaded=-2;
        }
        else
        { 
          //this.item={};//need to reset       
          Object.assign(this.item, this.default_item);          
        }        
      } 
       
    },
  }
}
</script>
