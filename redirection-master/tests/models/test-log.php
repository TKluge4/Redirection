<?php

class Log_Test extends WP_UnitTestCase {
	public function testBadId() {
		$this->assertFalse( Red_404_Log::get_by_id( 23232 ) );
	}

	public function testDeleteSingle() {
		$log = Red_404_Log::create( 'domain', 'url', '192.168.1.1', [] );

		$this->assertEquals( 1, Red_404_Log::delete( $log ) );
		$this->assertFalse( Red_404_Log::get_by_id( $log ) );
	}

	public function testValid404() {
		$log = Red_404_Log::create( 'domain', 'url', '192.168.1.1', [
			'agent' => 'agent',
			'referrer' => 'referrer',
			'http_code' => 404,
			'request_method' => 'GET',
			'request_data' => [
				'cats' => 4,
			],
		] );

		$json = Red_404_Log::get_by_id( $log )->to_json();
		$expected = [
			'url' => 'url',
			'agent' => 'agent',
			'referrer' => 'referrer',
			'domain' => 'domain',
			'ip' => '192.168.1.1',
			'http_code' => 404,
			'request_method' => 'GET',
			'request_data' => [
				'cats' => 4,
			],
		];

		unset( $json['created'] );
		unset( $json['created_time'] );
		unset( $json['id'] );

		$this->assertEquals( $expected, $json );
	}

	public function testLongDomain() {
		$log = Red_404_Log::create( str_repeat( 'a', Red_404_Log::MAX_DOMAIN_LENGTH + 1 ), 'url', '192.1.1.1', [] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( str_repeat( 'a', Red_404_Log::MAX_DOMAIN_LENGTH ), $json['domain'] );
	}

	public function testLongUrl() {
		$log = Red_404_Log::create( 'domain', str_repeat( 'a', Red_404_Log::MAX_URL_LENGTH + 1 ), '', [] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( str_repeat( 'a', Red_404_Log::MAX_URL_LENGTH ), $json['url'] );
	}

	public function testLongAgent() {
		$log = Red_404_Log::create( 'domain', 'url', '192.1.1.1', [ 'agent' => str_repeat( 'a', Red_404_Log::MAX_AGENT_LENGTH + 1 ) ] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( str_repeat( 'a', Red_404_Log::MAX_AGENT_LENGTH ), $json['agent'] );
	}

	public function testLongReferrer() {
		$log = Red_404_Log::create( 'domain', 'url', '192.1.1.1', [ 'referrer' => str_repeat( 'a', Red_404_Log::MAX_REFERRER_LENGTH + 1 ) ] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( str_repeat( 'a', Red_404_Log::MAX_REFERRER_LENGTH ), $json['referrer'] );
	}

	public function testLongIP() {
		$log = Red_404_Log::create( 'domain', 'url', str_repeat( 'a', Red_404_Log::MAX_IP_LENGTH + 1 ), [] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( str_repeat( 'a', Red_404_Log::MAX_IP_LENGTH ), $json['ip'] );
	}

	public function testNoIP() {
		$log = Red_404_Log::create( 'domain', 'url', '', [] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( '', $json['ip'] );
	}

	public function testBadRequestMethod() {
		$log = Red_404_Log::create( 'domain', 'url', '192.1.1.1', [ 'request_method' => 'cats' ] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( '', $json['request_method'] );
	}

	public function testBadHttpCode() {
		$log = Red_404_Log::create( 'domain', 'url', '192.1.1.1', [ 'http_code' => 'cats' ] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( 0, $json['http_code'] );
	}

	public function testRequestMethodCase() {
		$log = Red_404_Log::create( 'domain', 'url', '192.1.1.1', [ 'request_method' => 'get' ] );
		$json = Red_404_Log::get_by_id( $log )->to_json();
		$this->assertEquals( 'GET', $json['request_method'] );
	}

	private function get_default_query() {
		return [
			'orderby' => 'id',
			'direction' => 'DESC',
			'limit' => RED_DEFAULT_PER_PAGE,
			'offset' => 0,
			'where' => '',
		];
	}

	public function testDefaultQuery() {
		$query = [];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testBadFilterQuery() {
		$query = [
			'cats' => 5,
			'dogs' => 6,
		];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testBadOrder() {
		$query = [ 'orderby' => 'cats' ];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testBadDirection() {
		$query = [ 'direction' => 'up' ];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testBadPerPage() {
		$query = [ 'per_page' => 'cats' ];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );

		$query = [ 'per_page' => -1 ];
		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );

		$query = [ 'per_page' => 4000 ];
		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testBadPage() {
		$query = [ 'page' => 'cats' ];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );

		$query = [ 'page' => -1 ];
		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testbadFilterBy() {
		$query = [ 'filterBy' => 34 ];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testBadFilterMethod() {
		$query = [ 'filterBy' => [ 'method' => 'cats' ] ];
		$expected = $this->get_default_query();

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testBadFilterHttp() {
		$query = [ 'filterBy' => [ 'http' => 'cats' ] ];
		$expected = array_merge( $this->get_default_query(), [ 'where' => 'WHERE http_code = 0' ] );

		$this->assertEquals( $expected, Red_404_Log::get_query( $query ) );
	}

	public function testGoodQuery() {
		$query = [
			'page' => 4,
			'per_page' => 20,
			'direction' => 'asc',
			'orderby' => 'ip',
			'filterBy' => [
				'http' => 301,
				'method' => 'get',
				'ip' => '192.1',
				'domain' => 'domain',
				'url' => 'cats',
				'referrer' => 'referrer',
				'agent' => 'agent',
			],
		];
		$expected = [
			'orderby' => 'ip',
			'direction' => 'ASC',
			'limit' => 20,
			'offset' => 20 * 4,
			'where' => "WHERE ip LIKE '%192.1%' AND domain LIKE '%domain%' AND url LIKE '%cats%' AND referrer LIKE '%referrer%' AND agent LIKE '%agent%' AND http_code = 301 AND request_method = 'GET'",
		];
		$query = Red_404_Log::get_query( $query );
		$query['where'] = preg_replace( '/\{.*?\}/', '%', $query['where'] );

		$this->assertEquals( $expected, $query );
	}

	public function testFullIPFilter() {
		$query = [
			'filterBy' => [
				'ip' => '192.1.168.1',
			],
		];
		$expected = array_merge( $this->get_default_query(), [ 'where' => "WHERE ip = '192.1.168.1'" ] );
		$query = Red_404_Log::get_query( $query );

		$this->assertEquals( $expected, $query );
	}
}
