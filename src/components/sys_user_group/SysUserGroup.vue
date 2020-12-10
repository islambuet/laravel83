<template>
  <div v-if="$system_variables.status_task_loaded==1">
    <List v-if="method=='list'"/>    
    <AddEdit v-if="(method=='add') || (method=='edit')"/>  
    <Role v-if="method=='role'"/>   
  </div>
</template>

<script>
import List from './List.vue'
import AddEdit from './AddEdit.vue'
import Role from './Role.vue'
export default {
    name: 'SysUserGroup',
    components: {
        List,AddEdit,Role   
    },
    mounted:function()
    {
      this.$system_functions.load_task_languages([
            {language:this.$system_variables.language,file:'components/sys_user_group/language.js'},
        ]);
      this.init();        
    },
    data() {
      return {
        method:'list',        
        permissions:{'action_0':0},
        columns:{hidden_columns:[],control_columns:[],filter_columns:{},display_columns:[]},
        items:[],
        types:[],
        item:{},   
        modules_tasks:{'max_level':1,'tree':[]}, 
        module_task_max_action:9,
        default_item:{id:0,name:"",status:'Active',ordering:99},        
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
      if(route.path=='/sys_user_group')
      {
        this.method='list';       
        //this.get_items();
      }
      else if(route.path=="/sys_user_group/add")
      {
        this.method='add';
        this.addEdit(0);
      }
      //console.log(route);
      else if(route.path.indexOf("/sys_user_group/edit/")!=-1)
      {
        this.method='edit';        
        this.addEdit(route.params['item_id']);        
      }
      else if(route.path.indexOf("/sys_user_group/role/")!=-1)
      {
        this.method='role';        
        this.role(route.params['item_id']);        
      }
    },
    init:function()
    { 
        this.$system_variables.status_task_loaded=0;  
        this.$system_variables.status_data_loaded=1;  
        this.reload_items=true;
        this.$axios.get('/sys_user_group')
        .then(response=>{
            if(response.data.errorStr=='')        
            {
              this.permissions=response.data.permissions; 
              this.modules_tasks=response.data.modules_tasks;             
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
        title: this.$system_functions.get_label_task('label_num_tasks'),        
        dataIndex: 'num_tasks',
        sorter: (a, b) => a.num_tasks - b.num_tasks,                    
        width: 20,
      });
      this.columns.display_columns.push({
          title: this.$system_functions.get_label('label_name'),        
          dataIndex: 'name', 
          sorter: (a, b) => a.name.localeCompare(b.name),                   
          width: 100,
        });
      this.columns.display_columns.push({
        title: this.$system_functions.get_label('label_ordering'),        
        dataIndex: 'ordering',
        sorter: (a, b) => a.id - b.id,                     
        width: 20,
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
        this.$axios.get('sys_user_group/get_items')
        .then(response=>{          
        this.$system_variables.status_data_loaded=1;
            if(response.data.errorStr=='')
            {                  
                //this.setFilterColumns();
                this.setDisplayColumns();
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
            this.$router.push("/sys_user_group");            
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
    role:function(item_id)
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
              
              Object.assign(this.item, this.items[i]);              
              item_found=true;
              break;
            }
          }
          if(!item_found)
          {
            this.$router.push("/sys_user_group");            
          }
        }
    },
    
  }
}
</script>
