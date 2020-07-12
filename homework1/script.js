$(document).ready(function(){
    let record = 1;
    
    if(!$.isEmptyObject(localStorage) && Object.keys(localStorage).length > 1)
    {
        for(let i = 0; i < localStorage.getItem('record'); ++i){
            $('.content__contacts').append(
                $(`<tr class="content__row" data-index-number="${record - 1}">
                    <td class="content__cell">${(JSON.parse(localStorage.getItem(localStorage.getItem('record')-1-i)))['name']}</td>
                    <td class="content__cell">${(JSON.parse(localStorage.getItem(localStorage.getItem('record')-1-i)))['phone']}</td>
                    <td class="content__cell">${(JSON.parse(localStorage.getItem(localStorage.getItem('record')-1-i)))['email']}</td>
                    <td class="content__cell"><i class="fa fa-pencil" aria-hidden="true"></i></td>
                    <td class="content__cell"><i class="fa fa-times" aria-hidden="true"></i></td>
                </tr>`)
            ); 
        }
    } else {
        localStorage.clear();
    }

    $('.wrapper__add-button--now').click(function(){
        let name = prompt('input name');
        let phone = prompt('input phone');
        let email = prompt('input email');
        let record = localStorage.getItem('record') ? localStorage.getItem('record') : 0;

        let strCurrent = JSON.stringify({name: name, phone:phone, email:email});
        localStorage.setItem(`${record}`, strCurrent);
        localStorage.setItem('record', ++record);
        
        $('.content__contacts').append(
            $(`<tr class="content__row">
                <td class="content__cell">${(JSON.parse(localStorage.getItem(localStorage.getItem('record')-1)))['name']}</td>
                <td class="content__cell">${(JSON.parse(localStorage.getItem(localStorage.getItem('record')-1)))['phone']}</td>
                <td class="content__cell">${(JSON.parse(localStorage.getItem(localStorage.getItem('record')-1)))['email']}</td>
                <td class="content__cell"><i class="fa fa-pencil" aria-hidden="true"></i></td>
                <td class="content__cell"><i class="fa fa-times" aria-hidden="true"></i></td>
            </tr>`).on('click', 'i.fa-times', function(){
                $(this).parent().parent().remove();
                localStorage.removeItem(localStorage.getItem('record')-1);
                localStorage.setItem('record', localStorage.getItem('record')-1);
            }).on('click', 'i.fa-pencil', function(){
                let name = prompt('input name');
                let phone = prompt('input phone');
                let email = prompt('input email'); 

                let strChanged = JSON.stringify({name: name, phone:phone, email:email});
                localStorage.setItem(localStorage.getItem('record')-1, strChanged);
            })
        );
    });

    $('.fa-times').click(function(){
        let idRecord = $(this).parent().parent().attr('data-index-number');
        localStorage.removeItem(`${idRecord}`);
        $(this).parent().parent().remove();
    });

    $('i.fa-pencil').click(function(){
        let name = prompt('input name');
        let phone = prompt('input phone');
        let email = prompt('input email'); 

        let strChanged = JSON.stringify({name: name, phone:phone, email:email});
        localStorage.setItem($(this).parent().parent().attr('data-index-number'), strChanged);
    })
});