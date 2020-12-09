<template>
  <div>
     <div v-if="$system_variables.status_task_loaded==1">
    <List v-show="method=='list'"/>    
    <AddEdit v-show="method=='add' || method=='edit'"/>    
    </div>
  </div>
  
  
</template>

<script>
import List from './List.vue'
import AddEdit from './AddEdit.vue'
export default {
    name: 'SysModuleTask',
    components: {
        List,AddEdit   
    },
    mounted:function()
    {
      this.$system_functions.load_task_languages([
            {language:this.$system_variables.language,file:'components/register/language.js'},
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
        default_item:{id:0,name_en:"",name_bn:"",type:"",parent:'',controller:'',ordering:99,status:'Active',status_notification:''},
        max_level:0,
        reload_items:true
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
      if(route.path=='/sys_module_task')
      {
        this.method='list';
        //this.get_items();
      }
      /*else if(route.path=="/sys_module_task/add")
      {
        this.method='add';
        this.add_edit(0);
      }
      else if(route.path.indexOf("/sys_module_task/edit/")!=-1)
      {
        this.method='edit';        
        this.add_edit(route.params['item_id']);        
      }*/
    },
    init:function()
    { 
        this.$system_variables.status_task_loaded=0;  
        this.$system_variables.status_data_loaded=1;  
        this.reload_items=true;
        this.$axios.get('/sys_module_task')
        .then(response=>{
            if(response.data.errorStr=='')        
            {
              this.permissions=response.data.permissions;
              this.types=response.data.types;
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
        width: 20,
      });
      for(var level=0;level<=this.max_level;level++)
      {
        this.columns.display_columns.push({
          title: this.$system_functions.get_label('label_name'),        
          dataIndex: 'name_'+level,                    
          width: 100,
        });
                    
      }

    },
    getItems:function()
    {
        if(this.reload_items)
        {
            this.$system_variables.status_data_loaded=0;        
            this.$axios.get('sys_module_task/get_items')
            .then(response=>{          
            this.$system_variables.status_data_loaded=1;
                if(response.data.errorStr=='')
                {                   
                    this.max_level=response.data.modules_tasks.max_level;                    
                    //this.setFilterColumns();
                    this.setDisplayColumns();
                    this.items=response.data.modules_tasks.tree;                                                           
                    this.reload_items=false;
                }       
            })
            .catch(error => {   
              console.log(error);
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
        if(!(this.permissions.action2))
        {
          
          this.$system_variables.status_task_loaded=-2;
        }
        else
        {
          this.$system_variables.status_data_loaded=0;        
          var form_data=new FormData();
          form_data.append ('token_auth', this.$system_variables.user.token_auth);                  
          form_data.append ('item_id', item_id);
          this.$axios.post('/sys_module_task/get_item',form_data)
          .then(response=>{          
            this.$system_variables.status_data_loaded=1;
            if(response.data.error_type)        
            {            
              this.$bvToast.toast(this.$system_variables.get_label(response.data.error_type), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
              this.$router.push("/sys_module_task");
            }
            else
            {
              if(response.data.item)  
              {
                this.item=response.data.item; 
              }
              else
              {
                this.$bvToast.toast(this.$system_variables.get_label('Data Not Found'), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
                this.$router.push("/sys_module_task");
              }
            }        
          })
          .catch(error => {   
            this.$system_variables.status_data_loaded=1;
            this.$bvToast.toast(this.$system_variables.get_label("Response Error"), {title: this.$system_variables.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});  
            this.$router.push("/sys_module_task");            
          });
        }
      }
      else
      {
        if(!(this.permissions.action1))
        {
          this.$system_variables.status_task_loaded=-2;
        }
        else
        { 
          this.item={};//need to reset       
          Object.assign(this.item, this.default_item);          
        }        
      } 
       
    },
    
  }
}
</script>
