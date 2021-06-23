import { Component } from 'react';
import swal from 'sweetalert';
import Payment from '../components/payment';
import Subscription from '../components/subscription';
import Confirmation from '../components/confirmation';

export default class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
      subscription_plans : [],
      currentStep : 1,
      maxStep : 3,
      maxEligibleStep : 1,
      pricePerGB : 0,
      finalPrice : 0,
      errorMessage : '',
      subscriptionData : {
        duration : 12,
        size : 5,
        paymentUpfront : 'No',
      },
      paymentData : {
        cardNumber : '',
        expirationDate : '',
        securityCode : '',
      },
      confirmationData : {
        email : '',
        confirmationTnC : 0
      },
      typeMap : {
        1 : 'subscriptionData',
        2 : 'paymentData',
        3 : 'confirmationData',
      }
    }
	}

	componentDidMount() {
		fetch(`https://cloud-storage-prices-moberries.herokuapp.com/prices`)
    .then(response => response.json())
    .then(plans => {
      this.setState({
        subscription_plans : plans.subscription_plans || []
      }, () => {
        this.calculatePrice();
      })
    })
    .catch(e => {
      swal({
        title : "Some Error Occured!",
        text : "Please reload the page or try again later.",
        icon : "error"
      });
    })
	}

  handleInputChange = (e, stepType) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [stepType] : {...this.state[stepType], ...{[name] : value}}
    }, () => {
      if (stepType === "subscriptionData") {
        this.calculatePrice();
      }
    })
	}

  isCompleteStep = () => {
    let stepType = this.state.typeMap[this.state.currentStep];
    let completeStep = Object.values(this.state[stepType]).every(val => val && val !== "0");
    return completeStep;
  }

  isValidStep = () => {
    let {paymentData, confirmationData} = this.state;
    let errorMessage = ""
    let stepType = this.state.typeMap[this.state.currentStep];
    let date = new Date();
    if (stepType === "paymentData") {
      if (paymentData.cardNumber.length !== 19) {
        errorMessage = 'Incomplete card number.';
      } else if (paymentData.expirationDate.length !== 7) {
        errorMessage = 'Incomplete expiration date.'
      } else if (paymentData.expirationDate.split('/')[1] + paymentData.expirationDate.split('/')[0] <= date.getFullYear() + String(date.getMonth()).padStart(2, '0')) {
        errorMessage = 'Card is expired. Please try with another card.'
      } else if (paymentData.securityCode.length !== 3) {
        errorMessage = 'Incomplete Security Code.';
      }
    } else if (stepType === "confirmationData") {
      const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailFormat.test(confirmationData.email)) {
        errorMessage = 'Invalid email format.'
      }
    }
    if (errorMessage) {
      this.setState({
        errorMessage : errorMessage
      })
      return false;
    } else {
      this.setState({
        errorMessage : ""
      })
      return true;
    }
  }

  calculatePrice = () => {
    let {subscriptionData} = this.state;
    let subscription = this.state.subscription_plans.find(plan => {
      return plan.duration_months === +subscriptionData.duration;
    })
    let finalPrice = subscriptionData.size * subscription.price_usd_per_gb;
    if (subscriptionData.paymentUpfront === "Yes") {
      let discountPercent = 10;
      finalPrice = finalPrice - (finalPrice*discountPercent)/100;
    }
    this.setState({
      pricePerGB : subscription.price_usd_per_gb,
      finalPrice : finalPrice
    })
  }

  handlePrevious = () => {
    this.setState({
      currentStep : this.state.currentStep - 1,
      errorMessage : ''
    })
  }

  handleNext = () => {
    if (!this.isCompleteStep()) {
      this.setState({
        errorMessage : 'All the fields are required. Please fill the required fields!'
      })
    } else if (this.isValidStep()) {
      this.setState({
        currentStep : this.state.currentStep + 1,
        errorMessage : ''
      })
    }
  }

  handleSubmit = () => {
    if (!this.isCompleteStep()) {
      this.setState({
        errorMessage : 'All the fields are required. Please fill the required fields!'
      })
    } else if (this.isValidStep()) {
      fetch(`https://httpbin.org/post`, {
        method : "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          finalPrice : this.state.finalPrice,
          ...this.state.subscriptionData,
          ...this.state.paymentData,
          ...this.state.confirmationData
        })
      })
      .then(response => response.json())
      .then(res => {
        swal({
          title : "Order Successful!",
          text : "Thank you for choosing our service.",
          icon : "success",
          timer : "3000"
        })
        this.setState({
          errorMessage : ''
        })
      })
      .catch(e => {
        swal({
          title : "Some Error Occured!",
          text : "Please reload the page or try again later.",
          icon : "error"
        });
      })
    }
  }

	render() {
		return (
      <div className="container">
        <div className="text-center">
          <h2>Orders Details</h2>
        </div>
        <div className="jumbotron">
          <div className="row">
            <div className="col-md-3">
              <b>
                Subscription Plan
              </b>
            </div>
            <div className="col-md-3">
              {this.state.subscriptionData.size} GB/month for {this.state.subscriptionData.duration} months
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <b>
                Price per GB
              </b>
            </div>
            <div className="col-md-3">
              $ {this.state.pricePerGB}/GB
            </div>
          </div>
          <div className={this.state.subscriptionData.paymentUpfront === "No" ? "hidden" : "row"}>
            <div className="col-md-3">
              <b>
                Upfront Payment Discount
              </b>
            </div>
            <div className="col-md-3">
              10%
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <b>
                Final Price
              </b>
            </div>
            <div className="col-md-3">
              <b>
                $ {this.state.finalPrice}
              </b>
            </div>
          </div>
        </div>
        <div className={this.state.currentStep === 1 ? "show" : "hidden"}>
          <Subscription handleInputChange={this.handleInputChange} subscription={this.state.subscriptionData} isDisabled={this.state.currentStep !== 1}/>
        </div>
        <div className={this.state.currentStep === 2 ? "show" : "hidden"}>
          <Payment handleInputChange={this.handleInputChange} payment={this.state.paymentData}/>
        </div>
        <div className={this.state.currentStep === 3 ? "show" : "hidden"}>
          <Confirmation handleInputChange={this.handleInputChange} confirmation={this.state.confirmationData}/>
        </div>
        {this.state.errorMessage ? <p className="required">{this.state.errorMessage}</p> : ""}
        <br></br>
        <div className="row">
          <div className="col-md-offset-8 col-md-2 col-xs-offset-6 col-xs-3">
            <button className={this.state.currentStep > 1 ? "btn btn-block" : "hidden"} onClick={() => this.handlePrevious()}>
            Previous
            </button>
          </div>
          <div className="col-md-2 col-xs-3">
            <button className={this.state.currentStep < this.state.maxStep ? "btn btn-block btn-primary" : "hidden"} onClick={() => this.handleNext()}>
              Next
            </button>
            <button className={this.state.currentStep === this.state.maxStep ? "btn btn-block btn-success" : "hidden"} onClick={() => this.handleSubmit()}>
              Submit
            </button>
          </div>
        </div>
      </div>
		);
	}
}
