let labelCountPages = 3
let numberPage = 0

function listPlayers(inPageNumber) {

    $("tr:has(td)").remove()

    labelCountPages = $(`#count-1`).val();
    cleanButton()
    createButton()

    let url = `/rest/players?`
    const pageSize = `pageSize=${labelCountPages}`
    const pageNumber = `pageNumber=${inPageNumber}`
    url = url.concat(pageSize).concat('&').concat(pageNumber)

    changeColorButton(inPageNumber)
    numberPage = inPageNumber

    $.get(url, function (response) {
        $.each(response, function (index, item) {
            $("#table-id").find('tbody')
                .append($('<tr>')
                    .append($('<td class="center">').text(item.id))
                    .append($('<td>').text(item.name))
                    .append($('<td>').text(item.title))
                    .append($('<td class="center">').text(item.race))
                    .append($('<td class="center">').text(item.profession))
                    .append($('<td class="center">').text(item.level))
                    .append($('<td class="center">').text(new Date(item.birthday).toLocaleDateString()))
                    .append($('<td class="center">').text(item.banned))
                    .append($('<td class="center">').append(`<button class="button_gif" id=button_edit_${item.id} onclick=editAccount(${item.id})> <img class="img_gif"  src="/img/edit1.gif" alt="#">`))
                    .append($('<td class="center">').append(`<button class="button_gif" id=button_delet_${item.id} onclick=deleteAccount(${item.id})> <img class="img_gif" src="/img/delete.gif" alt="#">`))
                )
        })
    })
}

function getAllAccount() {
    const urlAccounts = "/rest/players/count";
    let res = 0
    $.ajax({
        url: urlAccounts,
        async: false,
        success: function (result) {
            res = parseInt(result)
        }
    })
    return res
}

function createButton() {
    let countAllAccounts = getAllAccount()
    let result = Math.ceil(countAllAccounts / labelCountPages)

    $('button.btn_class').remove()

    for (let i = 0; i < result; i++) {

        let button_tag = "<button>" + (i + 1) + "</button>"
        let btn = $(button_tag)
            .attr('id', `paging_button_${i + 1}`)
            .attr('onclick', `listPlayers(${i})`)
            .addClass('btn_class')
        $('#navbar-button').append(btn)
    }
}


function changeColorButton(numberPage) {
    let button = `#paging_button_${numberPage + 1}`
    $(button).css('background-color', 'rgb(255, 225, 0)')
}

function cleanButton() {
    $('#button.btn_class').remove()
}

function deleteAccount(id) {
    let urlDelAccount = `/rest/players/${id}`
    $.ajax({
        url: urlDelAccount,
        type: 'DELETE',
        success: function () {
            listPlayers(numberPage)
        }
    })
}

function editAccount(id) {
    let buttonEdit = `#button_edit_${id}`
    let buttonDelete = `#button_delet_${id}`
    $(buttonDelete).hide()
    $(buttonEdit).html(`<img src="/img/save.gif" width="40px" height="40px" alt="#">`)

    let current_tr_element = $(buttonEdit).parent().parent()
    let columns = current_tr_element.children()

    let td_name = columns[1]
    td_name.innerHTML = "<input id='input_name_" + id + "' type='text' value='" + td_name.innerHTML + "'>"

    let td_title = columns[2]
    td_title.innerHTML = "<input id='input_title_" + id + "' type='text' value='" + td_title.innerHTML + "'>"

    let td_race = columns[3]
    let race_id = `#select_race_${id}`
    let race_current_value = td_race.innerHTML

    td_race.innerHTML = getLabelRace(id)
    $(race_id).val(race_current_value).change()

    let td_profession = columns[4]
    let prof_id = `#select_prof_${id}`
    let prof_current_value = td_profession.innerHTML

    td_profession.innerHTML = getLabelProfession(id)
    $(prof_id).val(prof_current_value).change()

    let td_banned = columns[7]
    let banned_id = `#select_banned_${id}`
    let banned_current_value = td_banned.innerHTML

    td_banned.innerHTML = getLabelBanned(id)
    $(banned_id).val(banned_current_value).change()

    let save_tag = `saveAccount(${id})`
    $(buttonEdit).attr('onclick', save_tag)
}

function saveAccount(id) {
    let value_name = $(`#input_name_${id}`).val()
    let value_title = $(`#input_title_${id}`).val()
    let value_race = $(`#select_race_${id}`).val()
    let value_profession = $(`#select_prof_${id}`).val()
    // let  value_level = $(`#input_lvl_${id}`).val()
    // let  value_birthday = $(`#input_birthday_${id}`).val()
    let value_banned = $(`#select_banned_${id}`).val()

    let url = `/rest/players/${id}`

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": value_name,
            "title": value_title,
            "race": value_race,
            "profession": value_profession,
            "banned": value_banned
        }),
        success: function () {
            listPlayers(numberPage)
        }
    })
}

function getLabelRace(id) {
    let raceId = `select_race_${id}`
    return "<label for=`race`></label>" +
        "<select id=" + raceId + " name='race'>" +
        "<option value='HUMAN'>HUMAN</option>" +
        "<option value='DWARF'>DWARF</option>" +
        "<option value='ELF'>ELF</option>" +
        "<option value='GIANT'>GIANT</option>" +
        "<option value='ORC'>ORC</option>" +
        "<option value='TROLL'>TROLL</option>" +
        "<option value='HOBBIT'>HOBBIT</option>" +
        "</select>"
}

function getLabelProfession(id) {
    let profId = `select_prof_${id}`
    return "<label for=`prof`></label>" +
        "<select id=" + profId + " name='prof'>" +
        "<option value='WARRIOR'>WARRIOR</option>" +
        "<option value='ROGUE'>ROGUE</option>" +
        "<option value='SORCERER'>SORCERER</option>" +
        "<option value='CLERIC'>CLERIC</option>" +
        "<option value='PALADIN'>PALADIN</option>" +
        "<option value='NAZGUL'>NAZGUL</option>" +
        "<option value='WARLOCK'>WARLOCK</option>" +
        "<option value='DRUID'>DRUID</option>" +
        "</select>"
}

function getLabelBanned(id) {
    let bannedId = `select_banned_${id}`
    return "<label for=`ban`></label>" +
        "<select id=" + bannedId + " name='ban'>" +
        "<option value='true'>true</option>" +
        "<option value='false'>false</option>" +
        "</select>"
}

function newAccount() {
    let value_name = $(`#input_new_name`).val()
    let value_title = $(`#input_new_title`).val()
    let value_race = $(`#select_new_race`).val()
    let value_profession = $(`#select_new_prof`).val()
    let value_level = $(`#input_new_lvl`).val()
    let value_birthday = $(`#select_new_birthday`).val()
    let value_banned = $(`#select_new_banned`).val()

    let url = `/rest/players`
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": value_name,
            "title": value_title,
            "race": value_race,
            "level": value_level,
            "birthday": new Date(value_birthday).getTime(),
            "profession": value_profession,
            "banned": value_banned
        }),
        success: function () {
            $(`#input_new_name`).val()
            $(`#input_new_title`).val()
            $(`#select_new_race`).val()
            $(`#select_new_prof`).val()
            $(`#input_new_lvl`).val()
            $(`#select_new_birthday`).val()
            $(`#select_new_banned`).val()
            listPlayers(numberPage)
        }
    })
}