package com.fastcms.cms.controller.admin;

import com.fastcms.common.constants.FastcmsConstants;
import com.fastcms.core.template.FastcmsStaticHtmlManager;
import com.fastcms.utils.ApplicationUtils;
import freemarker.cache.TemplateLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping(FastcmsConstants.HOME_MAPPING + "/route")
public class RouteController {
    // 注入FreeMarker配置
    @Autowired
    private FreeMarkerConfigurer freeMarkerConfigurer;

    @RequestMapping({"/list"})
    public String list() {
        // 打印模板加载路径（调试用）
        TemplateLoader templateLoader = freeMarkerConfigurer.getConfiguration().getTemplateLoader();
        System.out.println("FreeMarker模板加载路径：" + templateLoader);
        return "/cms/page_bizCat";
    }
}
