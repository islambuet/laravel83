<template>
    <a-layout-header :style="{ background: '#fff'}" :class="'d-print-none'">
        <div :style="{float:'right'}">
            <img :src="$system_variables.user.profile_picture" v-if="$system_variables.user.profile_picture" alt="profileImage" class="rounded-circle" :style="{height:'32px',width:'32px'}">
            <img :src="'/images/profile.jpg'" v-else alt="Image" class="rounded-circle" :style="{height:'32px',width:'32px'}">
            <a-dropdown :trigger="['click']" :style="{float:'right'}">
                <a class="ant-dropdown-link" @click.prevent>
                 <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                <a-menu-item >{{$system_functions.get_label('label_welcome')}} {{$system_variables.user.name}}</a-menu-item >                
                <a-menu-item v-if="$system_variables.user.id > 0" @click="$system_variables.logout">{{$system_functions.get_label('label_logout')}}</a-menu-item>
                <a-menu-item v-if="$system_variables.user.id == 0"> <router-link to="/login">{{$system_functions.get_label('label_login')}}</router-link></a-menu-item> 
                <a-menu-item v-if="$system_variables.user.id == 0"> <router-link to="/register">{{$system_functions.get_label('label_register')}}</router-link></a-menu-item> 
                
            </a-menu>                
            </a-dropdown>
        </div>
        <a-dropdown :trigger="['click']" :style="{float:'right',marginRight:'10px'}">
            <a class="ant-dropdown-link" @click.prevent>
            {{$system_functions.get_label('label_change_language')}} <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
                <a-menu-item @click="$system_htm_elements_action.click_change_language($event,'en')">English</a-menu-item>
                <a-menu-item @click="$system_htm_elements_action.click_change_language($event,'bn')">বাংলা</a-menu-item>
            </a-menu>
        </a-dropdown>
        <a-dropdown :trigger="['click']" :style="{float:'right',marginRight:'15px'}">
            <a class="ant-dropdown-link" @click.prevent>
                <a-badge :count="$system_variables.shoping_cart.count" :offset="[5,-10]" :number-style="{ backgroundColor: '#52c41a'}">
                    <a-icon type="shopping-cart" :style="{color: '#40a9ff'}" />
                </a-badge>
            </a>
            <a-menu slot="overlay">
                <a-card style="min-width: 300px;" :bodyStyle="{padding:'5px'}" :bordered="false">
                    <a-card-meta title="Your Cart"></a-card-meta>
                    
                    <table v-if="$system_variables.shoping_cart.count>0"  class="ant-table-bordered">
                         <thead  class="ant-table-thead">
                            <tr>
                            <th>Item Name</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                            <tr v-for="(item) in $system_variables.shoping_cart.items"  :key="'cart_'+item.id"> 
                                <td>{{item.name}}</td>
                                <td>{{item.price}}</td>
                                <td>{{item.quantity}}</td>
                                <td>{{item.price*item.quantity}}</td>
                                <td><a-icon type="delete" theme="filled" :style="{  color: '#ff0000' }" @click="deleteItem(item.id)"/></td>
                            </tr>
                        </tbody>
                        <tfoot class="ant-table-tbody">
                            <tr>
                                <td colspan="3" style="text-align:right">Total</td>
                                <td>{{getCartTotal}}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>                    
                    <div v-else >You Cart Is empty</div>    
                    <router-link v-if="$system_variables.shoping_cart.count>0" to="/checkout" :class="'ant-btn ant-btn-primary ant-btn-md mr-2 mb-2'">Go To Checkout</router-link>                                  
                </a-card>
            </a-menu>
        </a-dropdown>
        
    </a-layout-header>
</template>
<script>
export default {
  data() {
    return {
      
    };
  },
  computed:{
      getCartTotal:function()
      {
        var total=0;
        for (const id in this.$system_variables.shoping_cart.items) {
            var item=this.$system_variables.shoping_cart.items[id];
            total+=(item.quantity*item.price);
        }
        return total;
      }
  },
  methods: {
    deleteItem:function(id) {
      var cart_items=this.$system_variables.shoping_cart.items;      
      delete cart_items[id];
      this.$system_variables.shoping_cart.count=Object.keys(cart_items).length;
      this.$system_variables.shoping_cart.items=cart_items;
      localStorage.setItem('shoping_cart', JSON.stringify(this.$system_variables.shoping_cart));
    },
    
  },
};
</script>
<style scoped>
.rounded-circle{
border-radius: 50%;
}
</style>