package com.fastcms.cms.controller.home;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.fastcms.cms.entity.Article;
import com.fastcms.cms.service.IArticleService;

import com.fastcms.common.constants.FastcmsConstants;

import com.fastcms.common.model.RestResult;
import com.fastcms.common.model.RestResultUtils;
import com.fastcms.common.utils.StrUtils;
import com.fastcms.core.mybatis.PageModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


/**
 * 文章管理
 * @author： wjun_java@163.com
 * @date： 2021/4/22
 * @description：
 * @modifiedBy：
 * @version: 1.0
 */
@RestController
@RequestMapping(FastcmsConstants.HOME_MAPPING + "/article")
public class HomeArticleController {

    @Autowired
    private IArticleService articleService;

    /**
     * 文章列表
     *
     * @param page
     * @return
     */
    @RequestMapping("list")
    public RestResult<Page<IArticleService.ArticleVo>> list(PageModel page) {
        QueryWrapper<Object> queryWrapper = Wrappers.query()
                .eq("a.status", Article.STATUS_PUBLISH)
                .orderByDesc("a.created");

        Page<IArticleService.ArticleVo> articleVoPage = articleService.pageArticleOpen(page.toPage(), queryWrapper);
        return RestResultUtils.success(articleVoPage);
    }
}