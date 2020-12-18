<template>
  <div  v-if="$system_variables.status_task_loaded==1">
    <a-row>
      <a-col :sm="8" v-for="(item,index) in items" :key="item.id" v-show="((pagination.current-1)*pagination.pageSize)<=index && index<(pagination.current*pagination.pageSize)">         
        <a-card :style="{padding:'10px',textAlign:'center'}">
          <div style="height:250px">
            <img v-if="item.pictures.length==1" alt="comming soon" :src="item.pictures[0].picture" style="max-height: 100%; max-width:100%"/>             
            <a-carousel arrows :dots="false" v-else :autoplay="true">
              <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
                <a-icon type="left-circle" />
              </div>
              <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
                <a-icon type="right-circle" />
              </div>              
              <img v-for="(picture,pindex) in item.pictures" :key="item.id+'_'+pindex" :src="picture.picture" :style="{width:'auto'}"/>                
            </a-carousel>             
          </div>
          
          <h2>{{item.name}}</h2>          
          <h4>{{item.price}}</h4>
          <a-input-search type='number' style="max-width: 200px;text-align:right" :id="'quantity_'+item.id" :enter-button="'Add To Cart'" :value="getQuantity(item.id)" @search="addToCart(item)"/>
          
        </a-card>
      </a-col>
    </a-row>  
    <a-row :style="{marginTop: '10px'}">
      <a-pagination
        show-size-changer
        v-model="pagination.current"
        :pageSizeOptions="pagination.pageSizeOptions"
        :showQuickJumper="pagination.showQuickJumper"
        :page-size.sync="pagination.pageSize"
        :total="pagination.total"      
      />
    </a-row>
  </div>      
</template>

<script>
export default {
  name: 'Shop',
  props: {
    msg: String
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
      controler_url:'shop',
      pagination:{total:0,pageSizeOptions:['9','27','54','108','540'],showQuickJumper:true,pageSize:9,current:1},//current_page,items_per_page to avoid confilct
      items:[],
      value: '',
      
    }
  },
  methods: {    
    init:function()
    {
      var $root=this;
      this.$system_variables.status_task_loaded=0;  
      this.$system_variables.status_data_loaded=1;
      this.$axios.get(this.controler_url)
      .then(response=>{
          if(response.data.errorStr=='')        
          {
            this.permissions=response.data.permissions; 
            this.$axios.get(this.controler_url+'/get_items')
            .then(response2=>{
                if(response2.data.errorStr=='')        
                {
                  this.$system_variables.status_task_loaded=1;  
                  this.items= response2.data.items;
                  this.pagination.total=this.items.length;
                  
                }
                else
                {
                    
                }        
            }).catch(error2 => {
              this.$system_variables.status_task_loaded=-1;
              if(error2.response && error2.response.data && error2.response.data.errorStr)
              {
                    this.$system_functions.responseErrorTask(error2.response.data.errorStr);
              }          
          });
          }    
      })
      .catch(error => {
          this.$system_variables.status_task_loaded=-1;
          if(error.response && error.response.data && error.response.data.errorStr)
          {
                this.$system_functions.responseErrorTask(error.response.data.errorStr);
                console.log('here');
          }          
      });
    },
    getQuantity:function(id)
    {
      var cart_items=this.$system_variables.shoping_cart.items;
      if(cart_items[id])
      {
        return cart_items[id].quantity;
      }
      else
      {
        return 0;
      }

    },
    addToCart:function(item)
    {
      var cart_items=this.$system_variables.shoping_cart.items;
      var quantity=document.getElementById('quantity_'+item.id).value;      
      if(quantity>0)
      {
        //add/update
        item.quantity=quantity;
        cart_items[item.id]=item;
        
      }
      else
      {
        delete cart_items[item.id];
      }
      this.$system_variables.shoping_cart.count=Object.keys(cart_items).length;
      this.$system_variables.shoping_cart.items=cart_items;
      localStorage.setItem('shoping_cart', JSON.stringify(this.$system_variables.shoping_cart));
      
    }
    
    
  },
}
</script>
  <style scoped>
  .ant-carousel,.ant-carousel >>> .slick-slider,.ant-carousel >>> .slick-list,.ant-carousel >>> .slick-slide,.ant-carousel >>> .slick-slide div,.ant-carousel >>> .slick-track{
      height: 100%;
  }
  .ant-carousel >>> .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #000000;
    background-color: rgba(31, 45, 61, 0.11);
    
  }
  .ant-carousel >>> .slick-slide div{
    display: flex;
  }
  .ant-carousel >>> .slick-slide img {
  
  display: block;
  margin: auto;
  width: auto!important;
  max-width: 100%;
  max-height: 100%;
}
  .ant-carousel >>> .custom-slick-arrow:before {
    display: none;
  }
  .ant-carousel >>> .custom-slick-arrow:hover {
    opacity: 0.5;
  }
</style>