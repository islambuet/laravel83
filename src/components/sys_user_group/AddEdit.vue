<template>
    <div v-if="$parent.permissions.action_1 || $parent.permissions.action_2" v-show="$system_variables.status_data_loaded==1">
        <a-card :class="'d-print-none'">
            <router-link to="/sys_user_group" :class="'ant-btn ant-btn-primary ant-btn-md mr-2 mb-2'">{{$system_functions.get_label('button_back')}}</router-link> 
            <a-button type="primary" :class="'mr-2 mb-2'" @click="save(false)">{{$system_functions.get_label('button_save')}}</a-button> 
            <a-button type="primary" :class="'mr-2 mb-2'" @click="save(true)">{{$system_functions.get_label('button_save_new')}}</a-button>
        </a-card>
        <a-card :title="$parent.item.id>0?'Edit ::'+$parent.item['name']:$system_functions.get_label_task('label_new')">
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
                <a-form-model-item has-feedback :label="$system_functions.get_label('label_name')" prop="name">
                  <a-input name='name' v-model="item.name"/>
                </a-form-model-item>                
                <a-form-model-item :label="$system_functions.get_label('label_ordering')">
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
    
  },
  data() {
        return {                        
            alert_message: '',
            alert_type:'error', 
            item:{id:0,name:"",status:'Active',ordering:99},        
            ItemRules: {
                name: [{ required: true, message: "Name (English) Requied)", trigger: 'blur' }],                
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
          this.$axios.post('sys_user_group/save_item',formData)
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
                      if(this.$route.path!="/sys_user_group/add")
                      {
                        this.$router.push("/sys_user_group/add");
                      }                      
                    }
                    else
                    {
                      this.$router.push("/sys_user_group");
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
    }
  }  
}
</script>