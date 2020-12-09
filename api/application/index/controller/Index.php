<?php

namespace app\index\controller;

use app\lib\Xml;
use think\Cache;
use think\Log;

class Index
{

    const PID = '215883';
    const BID = 100000362;
    const SIGN = 'b25005f4febb9da0a1d6a36c4d84da40';
    const KEY = '5fa39e6399953';
    const CACHE_PREFIX = '215883:';
    const RANK_PREFIX = 'qq20_rank';
    const PAY_PREFIX = 'qq20_pay';

    /**
     * 默认首页
     * @return false|string|\think\response\Json
     */
    public function index()
    {
        return json([
            'return_code' => '0',
            'return_msg'  => 'ok'
        ]);
    }

    /**
     * 创建订单
     */
    public function createOrder()
    {
        $nickname = request()->post('nick', '', 'safe_string');
        $openid   = request()->post('openid', '', 'safe_string');
//        $product_id = request()->post('product_id', 0, 'intval');
        $money = request()->post('money', 0, 'safe_string');

        if (empty($nickname)) {
            return $this->returnError('miss nick', '10004');
        }

        if (empty($openid)) {
            return $this->returnError('miss openid', '10005');
        }

//        if (empty($product_id)) {
//            return $this->returnError('miss product_id', '10006');
//        }

        list($msec, $sec) = explode(' ', microtime());
        $msectime = sprintf('%.0f', floatval($msec) * pow(10, 7));

        $order_no = date('ymdHis') . $msectime;

//        switch ($product_id) {
//            case 1:
//                $money = '5.00';
//                break;
//            case 2:
//                $money = '10.00';
//                break;
//            case 3:
//                $money = '20.00';
//                break;
//            case 4:
//                $money = '50.00';
//                break;
//        }

        if (!isset($money)) {
            return $this->returnError('empty money', '10007');
        }

//        $money = '0.01';

        $data = [
            'return_code' => '0',
            'return_msg'  => 'ok',
            'order_no'    => $order_no,
            'money'       => $money
        ];

        $result = $this->createOrderCacheInfo($order_no, $money, $openid, $nickname);

        if (empty($result)) {
            return $this->returnError('create order fail', '10008');
        }

        return json($data);
    }

    /**
     * 查询订单详情
     */
    public function getOrderInfo()
    {
        $order_no = request()->get('order_no', '', 'safe_string');

        if (empty($order_no)) {
            return $this->returnError('miss order_no', '10009');
        }

        // 查询订单情况
        $detail = $this->getOrderCacheInfo($order_no);

        if (!empty($detail) && isset($detail['status']) && $detail['status'] == 1) {
            $data = [
                'return_code' => '0',
                'return_msg'  => 'ok',
                'status'      => isset($detail['status']) ? $detail['status'] : 0,
                'rank'        => isset($detail['rank']) ? $detail['rank'] : 0,
            ];

            return json($data);
        }

        // 查询支付情况
        $data = $this->getGongYiOrderDetail($order_no);

        if (isset($data['status']) && $data['status'] === 1) {
            $detail['status']     = 1;
            $detail['pay_actual'] = $data['money'];
            $detail['pay_time']   = $data['time'];
        }

        if (!isset($detail['order_no'])) {
//            $detail['order_no'] = $order_no;
        } else {
            if (isset($detail['pay_time'])) {
                // 更新订单排名
                $detail = $this->updateOrderRank($detail);

                // 更新订单详情
                $this->updateOrderInfoCache($detail);
            }
        }

        $data = [
            'return_code' => '0',
            'return_msg'  => 'ok',
            'status'      => isset($detail['status']) ? $detail['status'] : 0,
            'rank'        => isset($detail['rank']) ? $detail['rank'] : 0,
        ];

        return json($data);
    }

    /**
     * 支付通知
     * @return string
     */
    public function notify()
    {

        $content = file_get_contents('php://input');

        if (empty($content)) {
            $content = request()->post();
        }

        $base = [
            'return_code' => 'FAIL',
            'return_msg'  => 'fail',
        ];

        $message = '';

        Log::error($content);

        try {
            $message = \app\lib\Xml::parse(strval($content));
        } catch (\Exception $e) {
            $base['return_msg'] = $e->getMessage();
        }

        if (empty($message)) {
            return Xml::build($base);
        }

        $message = array_filter($message);

        $sign = $message['sign'];
        unset($message['sign']);

        ksort($message);

        $message['key'] = self::KEY;

        $currentSign = strtoupper(md5(http_build_query($message)));

        if ($sign != $currentSign) {
            $base['return_msg'] = 'sign no match';
            return Xml::build($base);
        }

        if ($message['status'] !== 1) {
            $base['return_code'] = 'SUCCESS';
            $base['return_msg']  = 'no paid';
            return Xml::build($base);
        }

        $order_no = $message['btr_transcode'];

        // 查询订单情况
        $detail = $this->getOrderCacheInfo($order_no);

        if (empty($detail)) {
            $this->createOrderCacheInfo($order_no, $message['money']);
            $detail = $this->getOrderCacheInfo($order_no);
        }

        $detail['status']     = 1;
        $detail['pay_actual'] = $message['money'];
        $detail['pay_time']   = $message['attach'];

        // 更新订单排名
        $detail = $this->updateOrderRank($detail);

        // 更新订单详情
        $this->updateOrderInfoCache($detail);

        $base['return_code'] = 'SUCCESS';
        $base['return_msg']  = 'success';

        return Xml::build($base);
    }

    /**
     * 查询订单缓存信息
     * @param $order_no
     * @return mixed|object|\think\App
     */
    private function getOrderCacheInfo($order_no)
    {
        $key = self::CACHE_PREFIX . $order_no;

        return cache($key);
    }

    /**
     * 查询公益订单详情
     * @param $btr_transcode
     * @return array|mixed
     */
    private function getGongYiOrderDetail($btr_transcode)
    {
        $url = 'https://ssl.gongyi.qq.com/cgi-bin/gywcom_iot_query_trans.fcgi';

        $bid = self::BID;

        $key = self::KEY;

        $nonce_str = uniqid('qq20');

        $params = http_build_query(compact('bid', 'btr_transcode', 'nonce_str', 'key'));

        $sign = strtoupper(md5($params));

        $url = $url . '?' . http_build_query(compact('bid', 'btr_transcode', 'nonce_str', 'sign'));

        $result = get($url);

        $data = json_decode($result, true);

        if (!isset($data['data'], $data['data']['openid'], $data['data']['money'])) {
            Log::error('order_no: ' . $btr_transcode . ' ' . (string)$result);
            return [];
        }

        return $data['data'];
    }

    /**
     * 创建订单信息
     * @param $order_no
     * @param $money
     * @param $openid
     * @param $nickname
     * @return mixed|object|\think\App
     */
    private function createOrderCacheInfo($order_no, $money, $openid = '', $nickname = '')
    {

        $data = [
            'order_no'   => $order_no,
            'money'      => $money,
            'openid'     => $openid,
            'nickname'   => $nickname,
            'created_at' => date('Y-m-d H:i:s'),
            'rank'       => 0,
            'status'     => 0
        ];

        return $this->updateOrderInfoCache($data, 7200);
    }

    /**
     * 更新缓存
     * @param $data
     * @param int $expire
     * @return mixed|object|\think\App
     */
    private function updateOrderInfoCache($data, $expire = 0)
    {
        $key = self::CACHE_PREFIX . $data['order_no'];

        return cache($key, $data, $expire);
    }

    /**
     * 更新订单排名
     * @param $detail
     * @return mixed
     */
    private function updateOrderRank($detail)
    {
        try {
            // 排名
            $res = Cache::zadd(self::RANK_PREFIX, 1, $detail['order_no']);

            if ($res === false) {
                Log::error('order_no: ' . $detail['order_no'] . ' rank fail');
                Cache::lpush('rank_fail', $detail['order_no']);
            }

            $rank = Cache::zrank(self::RANK_PREFIX, $detail['order_no']);

            if ($rank !== false) {
                $detail['rank'] = $rank + 1;
            }

            // 支付订单
            $res = Cache::lpush(self::PAY_PREFIX, $detail['order_no']);

            if ($res === false) {
                Log::error('order_no: ' . $detail['order_no'] . ' pay fail');
                Cache::lpush('pay_fail', $detail['order_no']);
            }
        } catch (\Exception $exception) {
            Log::error('order_no: ' . $detail['order_no'] . ' redis fail');
        }

        return $detail;
    }

    /**
     * 返回错误
     * @param string $msg
     * @param string $err_code
     * @param array $return
     * @return \think\response\Json
     */
    private function returnError($msg = 'fail', $err_code = '1', $return = [])
    {

        $data = [
            'return_code' => (string)$err_code,
            'return_msg'  => $msg
        ];

        if (!empty($return)) {
            $data['data'] = $return;
        }

        return json($data);
    }
}
