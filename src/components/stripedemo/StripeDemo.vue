<template>  
  <a-row>
    <a-col :lg="{ span: 11, offset: 7 }" :sm="{ span: 13, offset: 5 }"> 
      <div id="card-element" :style="{border:'1px solid',padding:'1em',marginBottom:'1em'}" >Card Info will behere</div>
      <div id="payment-request-button">payment button will be here</div>
      <!-- <div id="iban-element" :style="{border:'1px solid',padding:'1em',marginBottom:'1em'}" ></div> -->
      <a-alert v-if="alert_message != ''" :type="alert_type" closable :style="{marginBottom:'1em'}"><p slot="description" v-html="alert_message"></p></a-alert> 
      <a-button type="primary" :class="'mr-2 mb-2'" @click="goStripe">Pay $10.99</a-button> 
      <div id="payment-request-button"></div>
      <div>
        Example card: 4242424242424242
        <br>
        Date: Any future date
        <br>
        CVC: Any 3 digits
        <br>
        For More testing go here <a target="_blank" href="https://stripe.com/docs/testing">https://stripe.com/docs/testing</a>                
      </div>
    </a-col>
  </a-row>
</template>

<script>
var style = {
    base: {
      iconColor: '#666ee8',
      color: '#31325f',
      fontWeight: 400,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#666ee8',
      },
    },
  };
  
export default {
  name: 'StripeDemo',
  props: {
    msg: String
  },
  mounted:function()
  {
      this.$system_variables.status_task_loaded=1;  
      this.$system_variables.status_data_loaded=1;
      this.init();
      
      
  },
  data() {
    return {
      controler_url:'stripedemo',
      alert_message: '',
      alert_type:'error',
      value: '',
      stripInfo:{stripe:'',elements:'',card:'',paymentIntent:''},
      STRIPE_PUBLISHABLE_KEY:'pk_test_51HrA8aC7Qt33rDM6vyYTk64F4Y1r8hpngc8GaupEse4OYEqMiqcPp8TMLZUfnjyNxAgB2so4P6Tla6UWoybnjJzf00LWtigRgg',      
      
    }
  },
  methods: {  
    init:async function()
    {
      this.stripInfo.stripe = Stripe( this.STRIPE_PUBLISHABLE_KEY );      
      this.stripInfo.elements = this.stripInfo.stripe.elements();
      //this.card = this.elements.create('card');
      this.stripInfo.card = this.stripInfo.elements.create('card', {style, hidePostalCode: true});      
      this.stripInfo.card.mount('#card-element');
      const response = await this.$axios.post('/stripedemo/get_intent');
      if(response.data.errorStr)
      {
        this.stripInfo.paymentIntent='';        
      }
      else
      {
        this.stripInfo.paymentIntent=response.data.intent;
      }
    },  
    goStripe:async function()
    { 
      var $root=this;
      var card=$root.stripInfo.card;
       const response = await this.stripInfo.stripe.confirmCardPayment(
          this.stripInfo.paymentIntent.client_secret,
          {
            payment_method: {
             card ,
              
            },
            
          },
        );
        if(response.error)
        {
          this.alert_message = response.error.message;
          this.alert_type = 'error';
        }
        else
        {
          console.log('show success');
        }
        console.log(response);
            return;
    
      
    },
    
    
  },
}
</script>
