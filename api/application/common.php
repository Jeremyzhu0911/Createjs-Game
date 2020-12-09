<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
if (!function_exists('get')) {
    /**
     * 获取内容
     * @param $url
     * @return bool|string
     */
    function get($url)
    {
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HEADER, 0);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $contents = curl_exec($ch);

        curl_close($ch);

        return $contents;
    }
}

if (!function_exists('safe_string')) {
    /**
     * 过滤内容
     * @param $content
     * @return string
     */
    function safe_string($content)
    {
        return addslashes(strip_tags(trim($content)));
    }
}