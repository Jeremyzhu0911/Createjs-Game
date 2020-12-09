<?php

namespace app\lib;

use think\exception\Handle;
use Exception;

/**
 * 应用异常处理类
 */
class ExceptionHandle extends Handle
{

    public function render(Exception $e)
    {

        return json([
            'return_code' => '1',
            'return_msg'  => 'system fail'
        ]);
    }
}