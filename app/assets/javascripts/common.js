window.qIndex = 0;
window.exam_started = false;
window.questionNo; 
window.lastQuestionIndex = 0;
window.answers =  {};
window.flagged = {};
window.previousQuestion = 0;
window.checkedOption = -1;

$(function(){
       qIndex = 0; 
      $('a.take-exam').click(function(e){
       e.preventDefault()
       window.open($(this).attr('href'),'exam',"directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=400,height=350");
      })

      $('a.start-exam').click(function(e){
       renderNextQuestion(); 
      })

      $("#result-container").hide();
      window.lastQuestionIndex = gon.questions.length - 1;
      if(!exam_started){
        hide_question_div(); 
        qIndex = 0;
      }
});

function hide_question_div(){
      $("#question").hide();
      $("#question-footer-nav").hide();
      $("#question-nav").hide();
      $("#time-left").hide();
      $("#end-test-div").hide();
}

function display_question_div(){
      $("#question").show();
      $("#question-footer-nav").show();
      $("#question-nav").show();
      $("#exam-start-button").hide();
      $("#time-left").show();
      $("#end-test-div").show();
}

function renderNextQuestion(questionNo){
   if (questionNo == 0 || questionNo == -1) qIndex += 1;
   renderQuestion(qIndex);
}

function renderPreviousQuestion(questionNo){
  if (questionNo == 0) qIndex -= 1;
  renderQuestion(qIndex);
}

function renderFirstQuestion(){
    populateQuestionNavBar();
     display_question_div();
    window.qIndex = 0;
    window.questionNo = 0;
    renderQuestion(0);
}

function renderQuestion(questionNo){
  window.questionNo = questionNo;
  saveAnswer();

     questionNo == lastQuestionIndex ? $("#next-question-button").hide() : $("#next-question-button").show();
     questionNo == 0                 ? $("#prev-question-button").hide() : $("#prev-question-button").show();
    
     qIndex = questionNo
     $("#questionOptions").html("");  
     $("#qTitle").html(gon.questions[qIndex].title);
     $("#qDescription").html(gon.questions[qIndex].description);
     var options = document.getElementById("questionOptions");
     for ( var key in gon.questions[window.qIndex].options ) { 
      var radio =  document.createElement('input');
          radio.id =  key ;  
          radio.type = 'radio';
          radio.name = gon.questions[window.qIndex]._id.$oid;
          radio.value = key;
          checkedOption = answers[radio.name];
       if ( key == checkedOption )
       radio.checked = true; 

       options.appendChild(radio);
       $(options).append(' ');
       $(options).append(gon.questions[window.qIndex].options[key]);
       $(options).append('<br><br>');
       
     } // for loop ends
    previousQuestion = qIndex;
 } //render next question ends here 

function populateQuestionNavBar(){
   var button_div = document.getElementById("question-nav-button");  
   var question_no;
     for(question_no = 1;question_no <= gon.questions.length;question_no++ ){
   var buttonnode = document.createElement('input');
       buttonnode.type = 'button';  
       buttonnode.name = 'Q'+ question_no; 
       buttonnode.value = 'Q' + question_no;
       buttonnode.id = 'Q' + question_no;
       buttonnode.className = 'btn btn-danger';
       buttonnode.onclick =  onClickHandler(question_no-1); 
       button_div.appendChild(buttonnode);
       $(button_div).append('<td></tr><tr><td>');
       //populate answers,flagged hash
       qid = gon.questions[question_no-1]._id.$oid;
       answers[qid] = '-1'
       flagged[qid] = false;
     } //for
}//popoulate Question Nav bar ends here 

function onClickHandler(i){
   return function(){
     renderQuestion(i);
     return false;
   };
}//onclickhandler to avoid for loop closure


function saveAnswer(){
  var  qid = gon.questions[previousQuestion]._id.$oid;
  var query = 'input\[name\=\"'+ qid + '\"\]:checked';
  gon.questions[previousQuestion].selected_option = $(query, '#questionOptions').val(); 
  answers[qid] = $(query,'#questionOptions').val();
}//saveAnswer


function showResults(){
 saveAnswer();   
  $.ajax({
            type: "POST",
            url: '/u/exam/' + gon.eid.$oid + '/answer', 
            data: {
              data: answers, 
                    },
            success: function (data) {
                       hide_question_div();
                       var $response = $(data);
                       var result_data = $response.find('#result-container').html();
                       debugger;
                       
                       $('#result').append(result_data);
                       $('#result').show();
                    }
        });
}//show results

function clearOptions(){


}
