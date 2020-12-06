<template>
  <a-row v-if="$system_variables.status_task_loaded == 1" v-show="$system_variables.status_data_loaded == 1">
      <a-col :lg="{ span: 11, offset: 7 }" :sm="{ span: 13, offset: 5 }"> 
        <a-alert v-if="alert_message != ''"            
            :type="alert_type"
            closable
            >
            <p slot="description" v-html="alert_message">
            </p>
        </a-alert>             
        <a-form-model ref="formRegister" id="formRegister" :model="registerInputs" :rules="registerInputRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
            <a-form-model-item has-feedback :label="$system_functions.get_label_task('label_name_en')" prop="name_en">
              <a-input name='name_en' v-model="registerInputs.name_en" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback :label="$system_functions.get_label_task('label_name_bn')" prop="name_bn">
              <a-input name='name_bn' v-model="registerInputs.name_bn" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback :label="$system_functions.get_label_task('label_mobile_no')" prop="mobile_no">
              <a-input name='mobile_no' v-model="registerInputs.mobile_no" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback :label="$system_functions.get_label_task('label_email')" prop="email">
              <a-input name='email' v-model="registerInputs.email" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback :label="$system_functions.get_label_task('label_password')" prop="password">
                <a-input-password name='password' v-model="registerInputs.password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{offset: 18 }">
                <a-button type="primary" @click="register">
                    {{$system_functions.get_label('label_register')}}
                </a-button>                
            </a-form-model-item>
          </a-form-model>
      </a-col>
    </a-row>
</template>

<script>

export default {
    name: 'Register',
    components: { },
    mounted:function(){
        this.$system_functions.load_task_languages([
            {language:this.$system_variables.language,file:'components/register/language.js'},
        ]);
        this.init();
    },
    data() {
        return {                        
            alert_message: '',
            alert_type:'error',
            otp_required: false,
            token_sms: '',
            registerInputs:{'email':'','password':''},
            registerInputRules: {
                name_en: [{ required: true, message: "Name (English) Requied)", trigger: 'blur' }],
                name_bn: [{ required: true, message: "Name(Bangla) Required", trigger: 'blur' }],
                mobile_no: [{ required: true, message: "Mobile No Required", trigger: 'blur' }],
                email: [{ required: true, message: this.$system_functions.get_label_task('msg_email_require'), trigger: 'blur' }],
                password: [{ required: true, message: "Pssword Required", trigger: 'blur' }],
            }

            // form_title: 'Fill out the form below to login.',
            // otp_error_message: ''
        }
    },
    methods:{    
        init: function()
        {   
            this.$system_variables.status_task_loaded=1;
            this.$system_variables.status_data_loaded=1;
        },               
        register: function(event)
        {
            this.$refs.formRegister.validate(valid => {
            if (valid) 
            {
                
                this.alert_message = '';
                this.$system_variables.status_data_loaded = 0;
                var formData=this.$system_functions.getFormData(new FormData(document.getElementById('formRegister')));                
                this.$axios.post('user/register',formData)
                    .then(response=>{                        
                        this.$system_variables.status_data_loaded = 1;
                        if(response.data.errorStr == '')
                        {
                            localStorage.setItem('api_token', response.data.user.api_token);                            
                            this.$system_functions.set_user(response.data.user);
                            this.$system_functions.setAxiosHeader();
                            this.$router.push("/");
                        }
                        else
                        {
                            this.alert_message = response.data.errorStr;
                            this.alert_type = 'error';
                        }
                        this.$system_variables.status_data_loaded = 1;
                    })
                    .catch(error => {
                        //console.log(error.response);
                        this.alert_type = 'error';
                        
                        
                        if(error.response && error.response.data && error.response.data.errorStr)
                        {
                            if(error.response.data.errorStr == 'LOGIN_FAILED')
                            {
                                this.alert_message = this.$system_functions.get_label('USER_NOT_FOUND');
                            }
                            else if(error.response.data.errorStr == 'VALIDATION_FAILED')
                            {
                                for (var err in error.response.data.errors) {
                                   this.alert_message+=error.response.data.errors[err][0]+'<br>';
                                    }
                                
                            }
                            else
                            {
                                this.$system_functions.responseErrorTask(error.response.data.errorStr);                                
                            }
                        }
                        else
                        {
                            this.alert_message = this.$system_functions.get_msg_response_error();
                        }
                        
                        this.$system_variables.status_data_loaded = 1;
                    });                
                } 
                
            });
            
            
        },
        
    }
}
</script>