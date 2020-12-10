<template>
  <a-layout>
    <Loading v-show="$system_variables.status_data_loaded == 0"/>    
    <Sidebar />
    <a-layout :id="'container_content'">
      <Header/>
      <a-layout-content :style="{ margin: '24px 16px 0',padding: '24px',background: '#fff', overflow: 'auto', height: 'calc(100vh - 88px)' }" v-if="status_site_loaded == 1">
        <LoadingFailed v-if="$system_variables.status_task_loaded == -1"/>
        <LoadingAccessDeny v-if="$system_variables.status_task_loaded == -2"/>
        <SiteOffLine v-if="$system_variables.status_task_loaded == -3"/>
         <router-view/>         
      </a-layout-content>
      <a-layout-content :style="{ margin: '24px 16px 0',padding: '24px',background: '#fff', overflow: 'auto', height: 'calc(100vh - 88px)' }" v-if="status_site_loaded == -1">
         <LoadingFailed/>         
      </a-layout-content>
      
    </a-layout>
  </a-layout>
</template>
<script>
import Loading from '@/views/busy_states/Loading.vue'
import LoadingFailed from '@/views/busy_states/LoadingFailed.vue'
import LoadingAccessDeny from '@/views/busy_states/LoadingAccessDeny.vue'
import SiteOffLine from '@/views/busy_states/SiteOffLine.vue'
import Sidebar from '@/views/template/Sidebar.vue'
import Header from '@/views/template/Header.vue'
export default {
  name: 'App',
  components: {
    Loading,LoadingFailed,LoadingAccessDeny,SiteOffLine,Sidebar,Header
  },
  data() {
    return {      
      status_site_loaded:0,//Loading=0,success=0,failed=-1  only this page 
    };
  },
  mounted: function()//before create
  {
    this.$system_functions.load_languages();
    this.$system_functions.set_page_title(this.$system_functions.get_label('label_site_title'));
    this.$system_functions.setAxiosHeader();
    this.init();
  },
  methods: {    
    init: function()
    {
      this.status_site_loaded=0;      
      this.$system_variables.status_data_loaded=0;        
      this.$axios.get('user/initialize',{params:{language:this.$system_variables.language}})
        .then(response=>{                        
            this.$system_variables.status_data_loaded = 1;
            if(response.data.errorStr == '')
            {
              if(response.data.user)
              {
                this.$system_functions.set_user(response.data.user);
              }
              if(response.data.visitor)
              {
                this.$system_variables.visitor.tasks=response.data.visitor.tasks;
              }
            }
            else
            {
                this.alert_message = response.data.errorStr;
                this.alert_type = 'error';
            }
            this.$system_variables.status_data_loaded = 1;
            this.status_site_loaded=1;
        })
        .catch(error => {
            //console.log(error.response);
            this.alert_type = 'error';
            
            if(error.response && error.response.data && error.response.data.errorStr)
            {
                this.$system_functions.responseErrorTask(error.response.data.errorStr);
            }
            else
            {
                this.$system_functions.responseErrorTask();//default Error
            }
            this.$system_variables.status_data_loaded = 1;
            this.status_site_loaded=1;
        });
    },
    
  },
};
</script>

<style>
  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
  .mr-2{
    margin-right: 2px;
  }
  .mb-2{
    margin-bottom: 2px;;
  }
  .ant-table td { white-space: nowrap; }


  @media (max-width:991px){
    #sidebar_left {
    position: fixed;
  }
  @media print{
    .d-print-none{
      display:none!important
    }
    .hasactionColumnFirst table td:first-child {display:none}
    .hasactionColumnFirst table th:first-child {display:none}
  }
}
</style>
