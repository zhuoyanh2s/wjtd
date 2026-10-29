// Tab 切换功能
    document.addEventListener('DOMContentLoaded', function() {
      const tabs = document.querySelectorAll('.query-tab');
      const forms = document.querySelectorAll('.query-form');
      
      // Tab 点击事件
      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const tabType = this.getAttribute('data-tab');
          
          // 移除所有 active 类
          tabs.forEach(t => t.classList.remove('active'));
          // 添加 active 类到当前 tab
          this.classList.add('active');
          
          // 隐藏所有表单
          forms.forEach(form => {
            form.style.display = 'none';
          });
          
          // 显示对应的表单
          const activeForm = document.querySelector(`[data-form="${tabType}"]`);
          if (activeForm) {
            activeForm.style.display = 'grid';
          }
        });
      });
      
    // 表单提交处理
      forms.forEach(form => {
        form.addEventListener('submit', function(e) {
      e.preventDefault();
      
          const formType = this.getAttribute('data-form');
          const departure = this.querySelector('[name="departurePort"], [name="departureAirport"]').value;
          const destination = this.querySelector('[name="destinationPort"], [name="destinationAirport"]').value;
      
          if (!departure || !destination) {
        alert('请填写完整的查询信息');
        return;
      }
          
          // 根据不同业务类型，可以跳转到不同的查询页面或使用不同参数
          let queryUrl = 'http://online.worldjaguar.com/';
          
          switch(formType) {
            case 'import-lcl':
              queryUrl += '?type=import-lcl';
              break;
            case 'export-lcl':
              queryUrl += '?type=export-lcl';
              break;
            case 'export-fcl':
              queryUrl += '?type=export-fcl';
              break;
            case 'air-freight':
              queryUrl += '?type=air-freight';
              break;
          }
          
          queryUrl += `&from=${departure}&to=${destination}`;
      
      // 跳转到外部查询系统
          window.open(queryUrl, '_blank');
        });
      });
      
    });