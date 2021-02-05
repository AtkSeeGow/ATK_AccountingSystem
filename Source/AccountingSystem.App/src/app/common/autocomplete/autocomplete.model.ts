declare const $: any;

export class AutocompleteModel {
  /**
   * 輸入框內容
   */
  inputValue: string = "";

  /**
   * 輸入框允許輸入字元上限
   */
  maxlength: number = 0;

  /**
   * 輸入框說明
   */
  placeholder: string = "";

  /**
   * 輸入框輸入事件
   * @param $event
   */
  keyup($event: any) {
    if (!this.isHookKey($event)) {
      this.inputValue = this.onValueChanged($event.target.value);
      this.currentIndex = -1;
    }
  };

  /**
   * 點擊輸入框本身動作
   * @param $event
   */
  click($event: any) {
    this.inputValue = this.onValueChanged($event.target.value);
    this.currentIndex = -1;
  };

  _menu: Dictionary = new Dictionary();
  set menu(dictionary: Dictionary) {
    this._menu = dictionary;

    const $lis = [];
    for (var key in this._menu) {
      const $li = $('<li class="ui-menu-item ui-widget-content" style="border-width: 1px; border-style: dashed; border-color: #2dce89;">').html(`<a key="${key}" class="ui-menu-item-wrapper">${this._menu[key]}</a>`);
      $lis.push($li);
    }

    this.$element.find('ul').html($lis);
    this.setCurrentIndex();
  };

  currentIndex: number = -1;
  private setCurrentIndex() {
    if (Object.keys(this._menu).length === 0) return;

    const $ele = this.$element;
    $ele.find('li').css('background', 'white');
    $ele.find('li').css('color', 'black');

    const $target = $ele.find(`li:nth-child(${this.currentIndex + 1})`);
    if (!$target.length) return;
    $target.css('background', '#ddd');

    const top = $target.position().top;
    const $ul = $target.parent();
    $ul.scrollTop($ul.scrollTop() + top - $ul.position().top);
  };

  $element: any;

  isDisplay: boolean = false;

  /**
   * 輸入值修改後，使用者因輸入值傳入新清單
   */
  onValueChanged: (value: string) => string = function () { return ""; };

  /**
   *  輸入值修改後，使用者因輸入值傳入新清單
   */
  onClick: (value: string) => string = function () { return ""; };

  /**
   * 選擇項目後事件
   * @param item
   */
  onExternalSelected(item: any) { };

  onInternalSelected(item: any) {
    var result = item.target.attributes.key.value;
    this.onExternalSelected(result);
  };

  displayMenu() {
    if (Object.keys(this._menu).length > 0) {
      this.isDisplay = true;
      this.$element.find('ul').fadeIn();
      this.$element.off('keydown');
      this.$element.on('keydown', (event: any) => {
        if (this.isHookKey(event)) {
          if (event.which == 13) {
            const $ele = this.$element;
            this.onInternalSelected({ target: $ele.find(`li:nth-child(${this.currentIndex + 1}) a`)[0] });
            this.hideMenu($ele);
            return;
          } else if (event.which == 38) {
            if (this.currentIndex <= 0)
              return;
            this.currentIndex--;
          } else if (event.which == 40) {
            if (this.currentIndex > Object.keys(this._menu).length)
              return;
            this.currentIndex++;
          }
          this.setCurrentIndex();
        }
      });
    }
  };

  hideMenu(event: any) {
    this.isDisplay = false;
    this.currentIndex = -1;

    this.$element.find('ul').fadeOut();
  }

  private isHookKey(event: any) {
    return event.which == 13 || event.which == 38 || event.which == 40;
  }
}

export class Dictionary {
  [index: string]: string;
}
