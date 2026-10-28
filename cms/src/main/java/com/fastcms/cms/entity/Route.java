package com.fastcms.cms.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fastcms.language.Language;

import java.io.Serializable;
import java.time.LocalDateTime;

//航线表
public class Route implements Serializable, Language {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createUserId;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime created;

    private LocalDateTime updateUserId;

    private LocalDateTime updated;


}
