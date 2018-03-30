document.addEventListener("DOMContentLoaded", function (event) {

    $(function () {

        const _selectors = {
            setUserName: '#setUserName',
            setEmail: '#setEmail',
            setPassword: '#setPassword',
            repeatPassword: '#repeatPassword',
            registerInfo: '#registerInfo',
            repeatPassword: '#repeatPassword',
            signUp: '#signUp',
        }

        const _handlers = {
            onSignUp: function () {
                const actualPassword = $(_selectors.setPassword).val();

                if (actualPassword !== $(_selectors.repeatPassword).val()) {
                    $(_selectors.registerInfo).text("Given passwords are different.")
                }
                else if ($('[required]').filter(function () { return this.value === '' }).length > 0) {
                    $(_selectors.registerInfo).text("Fill all mandatory fields.")
                }
                else {
                    $.ajax({
                        url: '/register',
                        data: JSON.stringify({
                            userName: $(_selectors.setUserName).val(),
                            userEmail: $(_selectors.setEmail).val(),
                            userPassword: actualPassword,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        type: "POST",
                        dataType: "json",

                        })
                        .then((ans) => {
                            if (ans.id !== null) {
                                location.href = "/login"
                            }
                            else {
                                $(_selectors.registerInfo).text("Cannot create account.")
                            }

                        })
                        .fail(function (err) {
                            console.log("Error. Cannot register.")
                        });
                }
            }
        }

        $(document).on('click', _selectors.signUp, _handlers.onSignUp);

    });
});


