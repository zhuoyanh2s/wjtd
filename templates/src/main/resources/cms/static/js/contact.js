document.addEventListener('DOMContentLoaded', function () {

    const branchList = [
      {
        name: '万嘉旗舰',
        tel: '+86-0532-68997888',
        fax: '+86-0532-68997877',
        email: 'info-qj@worldjaguar.com',
        address: '青岛市香港中路40新世界数码港旗舰大厦38层',
      },
      {
        name: "万嘉通商",
        tel: "+86-0532-86769363",
        fax: "+86-0532-86767220",
        email: "bonded-hd@worldjaguar.com",
        address: "青岛市黄岛区江山南路480号青岛研创中心4号楼504室"
      },
      {
        name: "万嘉威海",
        tel: "+86-0631-5278201-209",
        fax: "+86-0631-5278600",
        email: "wjed@wjexp.com",
        address: "威海市文化东路4号万嘉商务楼"
      },
      {
        name: "万嘉烟台",
        tel: "+86-0535-6862261/2/3/4/5/7/8/9",
        fax: "+86-0535-6862260",
        email: "yantai@worldjaguar.com",
        address: "烟台市芝罘区朝阳街80号绮丽大厦710室"
      },
      {
        name: "万嘉大连",
        tel: "+86-0411-82840166",
        fax: "+86-0411-82840167",
        email: "dalian@worldjaguar.com",
        address: "大连市中山区长江东路9号中信丰悦大厦3101室"
      },
      {
        name: '万嘉连云港',
        tel: '+86-0518-80628118',
        fax: '+86-0518-86089678',
        email: 'david-lyg@worldjaguar.com',
        address: '江苏省连云港市连云区中华西路48号18楼',
      },
      {
        name: '万嘉厦门',
        tel: '+86-592-5655066',
        fax: '+86-592-5655266',
        email: '##',
        address: '福建省厦门市自贸试验区屿南四路7号自贸金融中心A栋9层10-13',
      },
      {
        name: '万嘉西安',
        tel: '+86-029-85721983',
        fax: '##',
        email: 'xian@worldjaguar.com',
        address: '西安市高新区唐延路35号旺座现代城G座1903室',
      },
      {
        name: '万嘉空运',
        tel: '+86-0532-88268212',
        fax: '+86-0532-89083009',
        email: 'ecom.air@worldjaguar.com',
        address: '青岛市胶东国际机场盛港一路6号1号楼西塔楼3层',
      },
      {
        name: '万嘉天津',
        tel: '022-87129881',
        fax: '022-87129801',
        email: 'tianjin@worldjaguar.com',
        address: '天津市南开区鲁能国际中心27层',
      },
      {
        name: '万嘉上海',
        tel: '+86-021-80178288',
        fax: '+86-021-80178299',
        email: 'info-sha@worldjaguar.com',
        address: '上海市杨浦区贵阳路398号文通国际广场1205-1206室',
      },
      {
        name: '万嘉广州',
        tel: '+86-020-81179700',
        fax: '+86-020-81179700',
        email: 'Frank-hou@worldjaguar.com',
        address: '广州市越秀区中山六路232号越秀新都会大厦东座10A03',
      },
      {
        name: '万嘉石家庄',
        tel: '+86-0311-85255656',
        fax: '+86-0311-85255656',
        email: 'op-sjz@worldjaguar.com',
        address: '河北省石家庄市裕华区建华南大街215号万达广场写字楼B座1508室',
      },
      {
        name: '万嘉深圳',
        tel: '+86-0755-25126005',
        fax: '##',
        email: 'mrgl@worldjaguar.com',
        address: '深圳市罗湖区笋岗街道梨园路333号招商中环大厦B座2408',
      },
      {
        name: '万嘉洛杉矶',
        tel: '323-997-4788',
        fax: '323-593-6053',
        email: 'import@worldjaguarusa.com',
        address: '1 Civic Plaza Drive, Suite# 555, Carson, CA 90745',
      },
      {
        name: '万嘉宁波',
        tel: '+86-0574-87093737',
        fax: '+86-0574-87093711',
        email: 'Lorenali-nbo@worldjaguar.com',
        address: '宁波市海曙区中山西路布政巷16号科创大厦806室',
      },
      {
        name: '万嘉北京',
        tel: '010-89466338',
        fax: '##',
        email: '##',
        address: '北京市朝阳区望京保利国际广场T1-1402',
      },
      {
        name: '万嘉滨州',
        tel: '+86-543-3292277',
        fax: '##',
        email: '##',
        address: '滨州市黄河六路333号丰泽御景18号楼1425室',
      },
      {
        name: '万嘉成都',
        tel: '028-85012158',
        fax: '##',
        email: '##',
        address: '四川省成都市武侯区科华北路62号1栋907号',
      },
      {
        name: '万嘉湖南',
        tel: '0731-88808328/19198235499',
        fax: '##',
        email: '##',
        address: '长沙市开福区芙蓉中路一段479号建鸿达现代城1710室',
      },
      {
        name: '万嘉湖北',
        tel: '86-027-85829388',
        fax: '##',
        email: '##',
        address: '湖北省武汉市江汉区发展大道178号湖北捷龙大厦2009室',
      },
      {
        name: '万嘉重庆',
        tel: '##',
        fax: '##',
        email: '##',
        address: '##',
      },
      {
        name: '万嘉芝加哥',
        tel: '##',
        fax: '##',
        email: '##',
        address: '##',
      },
      {
        name: '万嘉纽约',
        tel: '##',
        fax: '##',
        email: '##',
        address: '##',
      },
      {
        name: '万嘉台北',
        tel: '02-2508-2788',
        fax: '886-2-25082790',
        email: 'florawang-tpe@worldjaguar. com',
        address: '台湾台北市中山區長安東路二段112號2樓',
      },
      {
        name: '万嘉香港',
        tel: '+852 2707 5999',
        fax: '+852 2777 9918',
        email: 'joeychow.hkg@worldjaguar.com',
        address: '香港九龙尖沙咀东部么地道 67 号半岛中心10 楼21-22室',
      },
      {
        name: '万嘉马来西亚',
        tel: '+60-389 389818',
        fax: '##',
        email: '##',
        address: 'B-9-1North Tower, BBT One, Lebuh Batu Nilam 1, Bandar Bukit Tinggi, 41200 Klang, Selangor Darul Ehsan, Malaysia',
      },
      {
        name: '万嘉新疆',
        tel: '0991-525173',
        fax: '##',
        email: '##',
        address: '新疆乌鲁木齐市经济技术开发区玄武湖路555号万达中心14号楼1503室',
      },
      {
        name: '万嘉济南',
        tel: '+86-0531-81763558',
        fax: '##',
        email: 'jinan.service@pandalogqd.com',
        address: '济南市高新区工业南路59号中铁财智中心4号楼1706',
      },
      {
        name: '万嘉铁必达',
        tel: '+86-0532-89012166',
        fax: '##',
        email: '26001',
        address: '青岛市香港中路40号新世界数码港旗舰大厦30F',
      },
      {
        name: '万嘉多伦多',
        tel: '+1 416 222 7805',
        fax: '##',
        email: '##',
        address: '116 Sheppard Avenue West, 2F, Toronto, Ontario, M2N 1M5, Canada',
      }
    ];

    const container = document.getElementById("branchContainer");

    branchList.forEach(item => {
      const card = document.createElement("div");
      card.className = "branch-card";
      card.innerHTML = `
        <div class="branch-name"><i class="fa fa-building-o"></i> ${item.name}</div>
        <div class="info-item"><i class="fa fa-phone"></i>电话： ${item.tel}</div>
        <div class="info-item"><i class="fa fa-fax"></i>传真： ${item.fax}</div>
        <div class="info-item"><i class="fa fa-envelope"></i>邮箱： ${item.email}</div>
        <div class="info-item"><i class="fa fa-map-marker"></i>地址： ${item.address}</div>
      `;
      container.appendChild(card);
    })

  
});
