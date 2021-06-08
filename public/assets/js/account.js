var showInput = function(){
    var textEmail = document.getElementById("text-email")
    var textUsername = document.getElementById("text-username")
    var textName = document.getElementById("text-name")
    var textPhone = document.getElementById("text-phone")
    var textCmnd = document.getElementById("text-cmnd");
    var textGender = document.getElementById("text-gender");
    var textJob = document.getElementById("text-job");
    var btnEdit = document.getElementById("btn_edit");

    var Email = document.getElementById("email")
    var Username = document.getElementById("username")
    var Name = document.getElementById("name")
    var Phone = document.getElementById("phone")
    var Cmnd = document.getElementById("cmnd");
    var Gender1 = document.getElementById("gender1");
    var Gender2 = document.getElementById("gender2");
    var Job = document.getElementById("job");
    var GroupBtn = document.getElementById("group-btn");

    textEmail.classList.add("d-none");
    textUsername.classList.add("d-none");
    textName.classList.add("d-none");
    textPhone.classList.add("d-none");
    textCmnd.classList.add("d-none");
    textGender.classList.add("d-none");
    textJob.classList.add("d-none");
    btnEdit.classList.add("d-none");

    Email.classList.remove("hidden");
    Username.classList.remove("hidden");
    Name.classList.remove("hidden");
    Phone.classList.remove("hidden");
    Cmnd.classList.remove("hidden");
    Gender1.classList.remove("d-none");
    Gender2.classList.remove("d-none");
    Job.classList.remove("hidden");
    GroupBtn.classList.remove("d-none");
}