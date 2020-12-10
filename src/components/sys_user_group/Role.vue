<template>
  <div v-if="$parent.permissions.action_2" v-show="$system_variables.status_data_loaded==1">    
    <a-card :class="'d-print-none'">
        <router-link to="/sys_user_group" :class="'ant-btn ant-btn-primary ant-btn-md mr-2 mb-2'">{{$system_functions.get_label('button_back')}}</router-link>
    </a-card>
    <a-collapse >
      <a-collapse-panel :header="modules_tasks_gropus.name" v-for="(modules_tasks_gropus, id) in get_modules_tasks_tree" :key="id" :forceRender="true">
        <a-button slot="extra" type="primary" :size="'small'" @click="save_role($event,'form_save_'+id)">{{$system_functions.get_label('button_save')}}</a-button> 
        <div class="ant-table-body" style="overflow-x: scroll;">       
          <form :id="'form_save_'+id">
            <table class="ant-table-bordered">
                <thead class="ant-table-thead">
                  <tr>
                      <th :colspan="modules_tasks_gropus.max_level">{{$system_functions.get_label_task('label_module_task_name')}}</th>
                      <th v-for="(j,i) in $parent.module_task_max_action" :key="'th'+i">
                        <label><input type="checkbox" :data-type="'header_action_'+i+'_'+id" class="header_action"> {{$system_functions.get_label('action_'+i)}}</label>
                      </th>
                  </tr>
                </thead>
                <tbody class="ant-table-tbody">
                  <tr v-for="(module_task) in modules_tasks_gropus.modules_tasks" :key="module_task.id"> 
                    <td v-for="(j, i) in modules_tasks_gropus.max_level" :key="'td'+i">                            
                      <label v-if="module_task.level==j">
                        <input type="hidden" :name="'tasks['+module_task.id+'][task_id]'" :value="module_task.id" v-if="module_task.type=='TASK'" />
                        <input type="checkbox" :data-id="module_task.id" :class="'task_action '+module_task.parent_class" />
                        {{module_task.name_en}}
                      </label>
                    </td>
                    <td v-for="(j, i) in $parent.module_task_max_action" :key="'td_action'+i" >
                      <label v-if="module_task.type=='TASK'">
                        <input type="checkbox" 
                        :class="'header_action_'+i+' header_action_'+i+'_'+id+' '+module_task.parent_class+' '+'parent_'+module_task.id" 
                        v-model="module_task['action_'+i]"
                        value="1"
                        :name="'tasks['+module_task.id+'][actions]['+i+']'"
                        :title="$system_functions.get_label('action_'+i)"
                        />                              
                      </label>
                    </td>
                  </tr>
                </tbody>
            </table>
          </form>
        </div>
      </a-collapse-panel>
    </a-collapse>

    
    
  </div>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
     
    };
  },
  mounted:function()
  {
    jQuery(document).ready(function()
    {
        $(document).off("click", ".header_action");
        $(document).on("click",'.header_action',function()
        {
            if($(this).is(':checked'))
            {
                $('.'+$(this).attr('data-type')).prop('checked', true);
            }
            else
            {
              $('.'+$(this).attr('data-type')).prop('checked', false);
            }
        });
        $(document).off("click", ".task_action");
        $(document).on("click",'.task_action',function()
        {

            if($(this).is(':checked'))
            {
                //$('.parent_'+$(this).attr('data-id')+':not(.header_action_3)').prop('checked', true);
                $('.parent_'+$(this).attr('data-id')+':not(.header_action_3,.header_action_7,.header_action_8)').prop('checked', true);
            }
            else
            {
                $('.parent_'+$(this).attr('data-id')).prop('checked', false);
            }
        });
    });

  },  
  computed:{   
    get_modules_tasks_tree:function(){ 
      var items={};
      var modules_tasks=this.$parent.modules_tasks.tree;      
      for(var i=0;i< modules_tasks.length;i++)
      {
        if(modules_tasks[i].level==1)
        {
          items[modules_tasks[i].module_task.id]={name:modules_tasks[i].module_task.name_en,modules_tasks:[],max_level:1};
          for(var j=i;j< modules_tasks.length;j++)
          {
            var item={};
            Object.assign(item,modules_tasks[j].module_task);
            item.level=modules_tasks[j].level;
            item.parent_class=modules_tasks[j].parent_class;
            items[modules_tasks[i].module_task.id].modules_tasks.push(item);
            if(item.level>items[modules_tasks[i].module_task.id].max_level)
            {
              items[modules_tasks[i].module_task.id].max_level=item.level;              
            }
            for(var k=0;k<this.$parent.module_task_max_action;k++)
            { 
              if(this.$parent.item['action_'+k].indexOf(','+item.id+',')>=0)
              {
                item['action_'+k]=true;
              }
              else
              {
                item['action_'+k]=false;
              }
            }
            if(((j+1)==modules_tasks.length)||(modules_tasks[j+1].level==1))            
            {
              i=j;              
              break;
            }
          }
                   
        }
      }
      //console.log(items);
      return items;
    }
  },
  methods:{  
    save_role:function(event,form_id){
      console.log(form_id);
      event.stopPropagation();
      this.$system_variables.status_data_loaded=0;       
      var form_data=new FormData(document.getElementById(form_id));
      this.$axios.post('sys_user_group/save_role/'+this.$parent.item.id,form_data)
        .then(response=>{                        
            this.$system_variables.status_data_loaded = 1;
            if(response.data.errorStr == '')
            {
                this.$notification.success({
                message: this.$system_functions.get_label('msg_success_title'),                    
                duration:10,
                description:this.$system_functions.get_label('msg_success_saved')
              });
                                  
            }
            else
            {
              this.$system_functions.responseErrorTask(response.data.errorStr);
            }
        })
        .catch(error => {
            
            if(error.response && error.response.data && error.response.data.errorStr)
            {
              if(error.response.data.errorStr == 'SAVE_FAILED')
              {
                  this.$notification.error({
                  message: this.$system_functions.get_label('msg_save_failed_title'),                    
                  duration:10,
                  description:this.$system_functions.get_label('msg_save_failed')
                });
                  
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
    
    
  }  
}
</script>