

$(document).ready(function(){
    let phone_book = {
    
        init : function (){
            if(localStorage.length)
            {
                let $contacts_container = $("#contacts");
                let contacts_html = '';
                let arrWithLocalStorageData = JSON.parse(localStorage.getItem('records')); 
                for(let i = 0; i < arrWithLocalStorageData.length; ++i){
                    contacts_html += `<tr class="content__row" data-index-number="${i}">
                            <td class="content__cell">${arrWithLocalStorageData[i]['name']}</td>
                            <td class="content__cell">${arrWithLocalStorageData[i]['phone']}</td>
                            <td class="content__cell">${arrWithLocalStorageData[i]['email']}</td>
                            <td class="content__cell"><i class="fa fa-pencil" aria-hidden="true"></i></td>
                            <td class="content__cell"><i class="fa fa-times" aria-hidden="true"></i></td>
                        </tr>`
                }
                $contacts_container.append(contacts_html);
            }
        },
    
        remove : function(that){
            $(that).parent().parent().remove();
            let id = $(that).parent().parent().attr('data-index-number');
            let tmpArr = JSON.parse(localStorage.getItem('records'));
            tmpArr.splice(id, 1);
            localStorage.setItem('records', JSON.stringify(tmpArr));
        },
    
        edit: function(that){
            let name = prompt('input name', 'John1');
            let phone = prompt('input phone', '1234-56-78');
            let email = prompt('input email', 'totalshit@gmail.com'); 
            if(email.search(/^.+@.+\..+$/) === -1 || /*phone.search(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/) === -1
                ||*/ name.search(/^[a-zA-Z](.[a-zA-Z0-9_-]*)$/) === -1){
                alert('doesnt work');
                return
            }
            let id = $(that).parent().parent().attr('data-index-number');
            let tmpArr = JSON.parse(localStorage.getItem('records'));
            tmpArr[id] = {name: name, phone: phone, email: email};
            localStorage.setItem('records', JSON.stringify(tmpArr));
        },
    
        add : function(){
            let name = prompt('input name', 'John');
            let phone = prompt('input phone', '7773-45-89');
            let email = prompt('input email', 'johndoe@gmail.com');
    
            if(email.search(/^.+@.+\..+$/) === -1 || /*phone.search(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/) === -1
                ||*/ name.search(/^[a-zA-Z](.[a-zA-Z0-9_-]*)$/) === -1){
                alert('doesnt work');
                return
            }
    
            let arrWithLocalStorageData = JSON.parse(localStorage.getItem('records')) ? JSON.parse(localStorage.getItem('records')) : []; 
            arrWithLocalStorageData.push({name: name, phone:phone, email:email});
    
            localStorage.setItem('records', JSON.stringify(arrWithLocalStorageData));
            let lastElIndex = arrWithLocalStorageData.length - 1;
            let that = this;
            $('#contacts').append(
                $(`<tr class="content__row" data-index-number="${lastElIndex}">
                    <td class="content__cell">${arrWithLocalStorageData[lastElIndex]['name']}</td>
                    <td class="content__cell">${arrWithLocalStorageData[lastElIndex]['phone']}</td>
                    <td class="content__cell">${arrWithLocalStorageData[lastElIndex]['email']}</td>
                    <td class="content__cell"><i class="fa fa-pencil" aria-hidden="true"></i></td>
                    <td class="content__cell"><i class="fa fa-times" aria-hidden="true"></i></td>
                </tr>`).on('click', 'i.fa-times', function(){
                    that.remove(this);        
                }).on('click', 'i.fa-pencil', function(){
                    that.edit(this);
                })
            );
        }
    };

    phone_book.init();

    $('#addButton').click(function(){
        phone_book.add(this);
    });

    $('i.fa-times').click(function(){
        phone_book.remove(this);
    });

    $('i.fa-pencil').click(function(){
        phone_book.edit(this);
    })
});