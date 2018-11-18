
// tabs script here 
$(function () {
    $('[data-tab]').on('click', function (e) {
        $(this)
            .addClass('active')
            .siblings('[data-tab]')
            .removeClass('active')
            .siblings('[data-content=' + $(this).data('tab') + ']')
            .addClass('active')
            .siblings('[data-content]')
            .removeClass('active');
        e.preventDefault();
    });


    function getCurrentDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return yyyy + '-' + mm + '-' + dd;
    }

    // sett today date 
    $('.js-currentDate').val(getCurrentDate());

    $(".js-item_qty").on('change', function () {
        $(".js-item_total").val(totalPrice());
    });
    function totalPrice(){
        var selectedQuantity = $(".js-item_qty").val();
        var itemPrice = $(".js-item_price").val();
        var totalPrice = selectedQuantity * itemPrice;
        $(".js-item_total").val(totalPrice);
        return totalPrice;
    }
    // sales report 
    $(".js-show_sales_reports").on('click', function () {
        event.preventDefault();
        var selectedDate = $('.js-dateFilter_sale').val();
        console.log(selectedDate);
        //return selectedDate;
        if (selectedDate !== "") {
            showSalesReportByDate(selectedDate);
        }
        else {
            $('.sales_wrapper > .js-error-date').toggle();
            setTimeout(() => $('.sales_wrapper > .js-error-date').hide(), 3000);
        }
        
    });
    // expense report 
    $(".js-show_expense_reports").on('click', function () {
        event.preventDefault();
        var selectedDate = $('.js-dateFilter_expense').val();
        console.log(selectedDate);
        //return selectedDate;
        
        if (selectedDate !== ""){
            showExpenseReportByDate(selectedDate);
        }
        else {
            $('.expense_wrapper > .js-error-date').toggle();
            setTimeout(() => $('.expense_wrapper > .js-error-date').hide(), 3000);
        }
    });
    
        
    
    

// to getting the form values
    $(".js-saleForm").on('submit', function (e) {
        e.preventDefault();
        var results = getSalesData();
        var totalItem = [];
        if(results){
            var totalItemStr = localStorage.getItem("sale");
            if (totalItemStr !== null) {
                totalItem = JSON.parse(totalItemStr);
                
                totalItem.push(results);
            }
            else {
                totalItem.push(results);
            }
            //console.log(results);
            localStorage.setItem('sale', JSON.stringify(totalItem));
            console.log(' new sale item is added ' + JSON.stringify(results));

            // display added item in the table
        }
            // toggle the class every five second
            $('.js-sucess').toggle();
            // toggle back after 5 second
            setTimeout(() => $('.js-sucess').hide(), 3000);
    });
    // js-saleForm end here 

    function getSalesData(){
        var item = {};
        item.name = $(".js-item-name").val();
        item.price = $(".item_price").val();
        item.quantity = $(".js-item_qty").val();
        item.total = $(".js-item_total").val();
        item.date = $(".js-currentDate").val();
        return item;
    }
    $(".js-expenseForm").on('submit', function (e) {
        e.preventDefault();
        var results = getExpenseData();
        var totalExpense = [];
        if (results) {
            var totalExpenseStr = localStorage.getItem("expense");
            if (totalExpenseStr !== null) {
                totalExpense = JSON.parse(totalExpenseStr);
                totalExpense.push(results);
            }
            else {
                totalExpense.push(results);
            }
            //console.log(results);
            localStorage.setItem('expense', JSON.stringify(totalExpense));
            console.log(' new expense is added ' + JSON.stringify(results));

        }
        // toggle the class every five second
        $('.js-sucess').toggle();
        // toggle back after 5 second
        setTimeout(() => $('.js-sucess').hide(), 3000);
    });
    // js-saleForm end here 
    function getExpenseData() {
        var expense = {};
        expense.name = $(".js-expense_name").val();
        expense.amount = $(".js-expense_amount").val();
        expense.date = $(".js-currentDate").val();
        return expense;
    }

});

//localStorage.getItem("sale");
// storedItems = localStorage.getItem('sale');
//var filterDataObj = JSON.parse(storedItems);
//var found_names = $.grep(filterDataObj, function (i) {
    //return i.date == '16/11/2018';
//});
// sales report 

function showSalesReportByDate(selectedDate){
    //var selectedDate = $(".js-currentDate").val();
    var storedItems = localStorage.getItem('sale');
    if (!storedItems) {
        showErrorMsgForincome();
        return;
    }
    var filteredData = JSON.parse(storedItems);
    var storedItemsFilterByDate = $.grep(filteredData, function (i) {
        console.log(' log' + i.date );
        return i.date == selectedDate;
    });
    
    
    if (storedItemsFilterByDate.length) {
        // console.log(storedItemsFilterByDate);
        var wrapper = "<table class='my-3 table table-bordered table-striped'> <thead> <tr> <th scope='col'>Date</th><th scope='col'>Item Name</th> <th scope='col'>Quantity</th> <th scope='col'>Amount</th> </tr> </thead> <tbody>";
        var totalAmount = 0;
        var totalQty = 0;
        for (var i = 0; i < storedItemsFilterByDate.length; i++) {
            wrapper = wrapper + "<tr> <td>" + storedItemsFilterByDate[i].date + "</td> <td>" + storedItemsFilterByDate[i].name + "</td>  <td>" + storedItemsFilterByDate[i].quantity + "</td> <td>" + storedItemsFilterByDate[i].total + "</td> </tr>";
            totalAmount = totalAmount + Number(storedItemsFilterByDate[i].total);
            totalQty = totalQty + Number(storedItemsFilterByDate[i].quantity);
        }
        wrapper = wrapper + "<tr class='table-success'> <th colspan='2'> <label>Grand Total </label> </th> <th> <label>" + totalQty + "</label> </th> <th class='font-weight-bold'>" + totalAmount + "<span></th> </tr></tbody > </table >";
        $(".sales_reports__content").html(wrapper);
    }
    else {
        showErrorMsgForincome();
    }


}
function showErrorMsgForincome () {
    $('.sales_reports__content').empty();
    $('.sales_wrapper > .js-error').toggle();
    setTimeout(() => $('.sales_wrapper > .js-error').hide(), 3000);
}
// expense report 
function showExpenseReportByDate(selectedDate) {
    var storedItems = localStorage.getItem('expense');
    if (!storedItems){
        showErrorMsgForExpense();
        return;
    }
    var filteredData = JSON.parse(storedItems);
    var storedItemsFilterByDate = $.grep(filteredData, function (i) {
        console.log(' log' + i.date);
        return i.date == selectedDate;
    });
    
    if (storedItemsFilterByDate.length) {
        // console.log(storedItemsFilterByDate);
        // var filteredData = JSON.parse(storedItemsFilterByDate);
        $('.expense_reports__content').empty();
        var wrapper = "<table class='my-3 table table-bordered table-striped'> <thead> <tr> <th scope='col'>Date</th> <th scope='col'>Expense Name</th>  <th scope='col'>Expense Amount</th> </tr> </thead> <tbody>";
        var totalExpense = 0;
        for (var i = 0; i < storedItemsFilterByDate.length; i++) {
            wrapper = wrapper + "<tr> <td>" + storedItemsFilterByDate[i].date + "</td> <td>" + storedItemsFilterByDate[i].name + "</td>  <td>" + storedItemsFilterByDate[i].amount + "</td> </tr>";
            totalExpense = totalExpense + Number(storedItemsFilterByDate[i].amount);
        }
        wrapper = wrapper + "<tr class='table-success'> <th colspan='2'> <label> Total Expense </label> </th> <th class='font-weight-bold'>" + totalExpense + "<span></th> </tr></tbody > </table >";
        $(".expense_reports__content").html(wrapper);
    }
    else {
        showErrorMsgForExpense();
    }
}
function showErrorMsgForExpense() {
    $('.expense_reports__content').empty();
    $('.expense_wrapper > .js-error').toggle();
    setTimeout(() => $('.expense_wrapper > .js-error').hide(), 3000);
}


        
