<template>
    <div v-if="$parent.permissions.action_1 || $parent.permissions.action_2" v-show="$system_variables.status_data_loaded==1">
        <a-card :class="'d-print-none'">
            <router-link to="/sys_module_task" :class="'ant-btn ant-btn-primary ant-btn-md mr-2 mb-2'">{{$system_functions.get_label('button_back')}}</router-link> 
            <a-button type="primary" :class="'mr-2 mb-2'" @click="save(false)">{{$system_functions.get_label('button_save')}}</a-button> 
            <a-button type="primary" :class="'mr-2 mb-2'" @click="save(true)">{{$system_functions.get_label('button_save_new')}}</a-button>
        </a-card>
        <a-card :title="$parent.item.id>0?'Edit ::'+$parent.item['name_'+$system_variables.language]:$system_functions.get_label_task('label_sys_module_task_new')">
          <a-col :lg="{ span: 11, offset: 7 }" :sm="{ span: 13, offset: 5 }"> 
            <a-alert v-if="alert_message != ''"            
                :type="alert_type"
                closable
                >
                <p slot="description" v-html="alert_message">
                </p>
            </a-alert>             
            <a-form-model ref="formSave" id="formSave" :model="item" :rules="ItemRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
              <input type="hidden" name="id" :value="item.id"/>
                <a-form-model-item has-feedback :label="$system_functions.get_label_task('label_name_en')" prop="name_en">
                  <a-input name='name_en' v-model="item.name_en"/>
                </a-form-model-item>
                <a-form-model-item has-feedback :label="$system_functions.get_label_task('label_name_bn')" prop="name_bn">
                  <a-input name='name_bn' v-model="item.name_bn"/>
                </a-form-model-item>
                <a-form-model-item :label="$system_functions.get_label_task('label_parent')">
                  <select class="ant-input" name="parent" v-model="item.parent">
                    <option value="0">Main Menu</option>
                    <option :value="parent.value" v-for="parent in getParents" :key="parent.value">{{parent.text}}</option>                                   
                  </select>           
                </a-form-model-item>

                <a-form-model-item :label="$system_functions.get_label_task('label_type')">
                  <select class="ant-input" name="type" v-model="item.type">
                    <option :value="type" v-for="type in $parent.types" :key="type">{{type}}</option>                                   
                  </select>        
                </a-form-model-item>
                

                <a-form-model-item :label="$system_functions.get_label_task('label_controller')">
                  <a-input name='controller' v-model="item.controller"/>
                </a-form-model-item>
                <a-form-model-item :label="$system_functions.get_label_task('label_ordering')">
                  <a-input name='ordering' v-model="item.ordering"/>
                </a-form-model-item>
                <a-form-model-item :label="$system_functions.get_label('label_status')" prop="status">
                  <select class="ant-input" name="status" v-model="item.status">
                    <option value="Active">Active</option>
                    <option value="In-Active">In-Active</option>                    
                  </select>                  
                </a-form-model-item>
              </a-form-model>
          </a-col>
        </a-card>
    </div>
</template>

<script>
export default {
  name: 'AddEdit',
  mounted:function()
  {  
    Object.assign(this.item, this.$parent.item); 
  },  
  computed:{   
    getParents:function(){ 
      var temp_items=[];  
      for(var i=0;i<this.$parent.items.length;i++)
      {
        if(this.$parent.items[i].module_task.type!='TASK')
        {
          temp_items.push({value:this.$parent.items[i].module_task.id,text:this.$parent.items[i].prefix+''+this.$parent.items[i].module_task['name_en']});
        }
      } 
      return temp_items;

    }
  },
  data() {
        return {                        
            alert_message: '',
            alert_type:'error', 
            item:{id:0,name_en:"",name_bn:"",type:"MODULE",parent:"0",controller:'',ordering:99,status:'Active',status_notification:'No'},           
            ItemRules: {
                name_en: [{ required: true, message: "Name (English) Requied)", trigger: 'blur' }],
                name_bn: [{ required: true, message: "Name(Bangla) Required", trigger: 'blur' }],               
                status: [{ required: true, message: "status Required", trigger: 'blur' }],               
            }

            // form_title: 'Fill out the form below to login.',
            // otp_error_message: ''
        }
    },
  methods:{
    
    save:function(save_and_new)
    {
      this.$refs.formSave.validate(valid => {
      if (valid) 
      {   
          this.alert_message = '';
          this.$system_variables.status_data_loaded = 0;
          var formData=this.$system_functions.getFormData(new FormData(document.getElementById('formSave')));                
          this.$axios.post('sys_module_task/save_item',formData)
              .then(response=>{                        
                  this.$system_variables.status_data_loaded = 1;
                  if(response.data.errorStr == '')
                  {
                    this.$parent.reload_items=true;
                          this.$notification.success({
                          message: this.$system_functions.get_label('msg_success_title'),                    
                          duration:10,
                          description:this.$system_functions.get_label('msg_success_saved')
                        });
                    if(save_and_new)
                    {
                      Object.assign(this.item, this.$parent.default_item);
                      if(this.$route.path!="/sys_module_task/add")
                      {
                        this.$router.push("/sys_module_task/add");
                      }     
                    }
                    else
                    {
                      this.$router.push("/sys_module_task");
                    }                     
                  }
                  else
                  {
                      this.alert_message = response.data.errorStr;
                      this.alert_type = 'error';
                  }
                  this.$system_variables.status_data_loaded = 1;
              })
              .catch(error => {
                console.log(error);
                  this.alert_type = 'error';            
                  if(error.response && error.response.data && error.response.data.errorStr)
                  {
                      if(error.response.data.errorStr == 'VALIDATION_FAILED')
                      {
                          for (var err in error.response.data.errors) {
                              this.alert_message+=error.response.data.errors[err][0]+'<br>';
                              }
                      }
                      else if(error.response.data.errorStr == 'SAVE_FAILED')
                      {
                          this.alert_message+=error.response.data.message;
                      }
                      else
                      {
                          this.$system_functions.responseErrorTask(error.response.data.errorStr);                                
                      }
                  }
                  else
                  {
                      this.$system_functions.responseErrorTask();//default Error
                  }
                  this.$system_variables.status_data_loaded = 1;
              });                
          } 
          
      });
      /*this.$system_variables.status_data_loaded=0; 
      var form_data=new FormData(document.getElementById('form_save'));       
      form_data.append ('token_auth', this.$system_variables.user.token_auth); 
      this.$axios.post('/sys_module_task/save_item',form_data)
      .then(response=>{          
        this.$system_variables.status_data_loaded=1;
        if(response.data.error_type)        
        {            
          this.$bvToast.toast(this.$system_functions.get_label(response.data.error_type), {title: this.$system_functions.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});
        }
        else
        {
            this.$parent.reload_items=true;
            this.$system_variables.status_data_loaded=1;
            this.$bvToast.toast(this.$system_functions.get_label("Saved SuccessFully"), {title: this.$system_functions.get_label('label_Success'),variant:'Success',autoHideDelay: 5000,appendToast: false});              
            if(save_and_new)
            {
              this.$router.push("/sys_module_task/add");
            }
            else
            {
              this.$router.push("/sys_module_task");
            }
        }                 
      })
      .catch(error => {   
        this.$system_variables.status_data_loaded=1;
        this.$bvToast.toast(this.$system_functions.get_label("Response Error"), {title: this.$system_functions.get_label('label_error'),variant:'danger',autoHideDelay: 5000,appendToast: false});   
      });   */              
          
          
      /*this.$systemVariables.statusSaving=1;        
      var formData=new FormData(document.getElementById('form_save_variety'));
      formData.append ('tokenAuth', this.$systemVariables.user.tokenAuth);      
          
            
      this.$axios.post('/variety/save_item',formData)
      .then(response=>{          
        this.$systemVariables.statusSaving=0;
        if(response.data.errorString)        
        {            
          if(response.data.errorString==this.$systemResponse.NoAccess)
          { 
            this.$systemVariables.statusTaskLoaded=-2;
          }
          else
          {
              this.$systemVariables.statusDataLoaded=1;
              this.$bvToast.toast(response.data.errorString, {
                title: 'Error',
                autoHideDelay: 5000,
                appendToast: false    
              });
          }          
        }
        else
        {
            this.$parent.reloadItems=true;
            this.$bvToast.toast("variety saved Succesfully", {
                title: 'Success',
                autoHideDelay: 5000,
                appendToast: false    
              });
              if(save_and_new)
              {
                this.$router.push("/variety/add");
              }
              else
              {
                this.$router.push("/variety");
              }
              
        }        
      })
      .catch(error => {   
        this.$systemVariables.statusSaving=0;
        this.$bvToast.toast('Server Error', {
          title: 'Save Problem',
          autoHideDelay: 5000,
          appendToast: false
        });     
      });*/
    }
  }  
}
</script>