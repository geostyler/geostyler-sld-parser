<!--SLD file created with GeoCat Bridge v2.0.0 using ArcGIS Desktop with
	Geoserver extensions. Date: 18 February 2016 See www.geocat.net for more
	details
	Origin:	https://register.geostandaarden.nl/visualisatie/top10nl/1.2.0/Wegdeel_Vlak_style.sld
	Date: 09.07.2024
	-->
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld"
	xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
	version="1.0.0">
	<NamedLayer>
		<Name>Wegdeel_vlak</Name>
		<UserStyle>
			<Name>Wegdeel_vlak_style</Name>
			<Title>Wegdeel vlak style</Title>
			<FeatureTypeStyle>
				<Rule>
					<Name>autosnelweg</Name>
					<Title>autosnelweg</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10202]]></ogc:Literal>
								<ogc:Literal><![CDATA[10200]]></ogc:Literal>
								<ogc:Literal><![CDATA[10201]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#996089</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>fietspad</Name>
					<Title>fietspad</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10742]]></ogc:Literal>
								<ogc:Literal><![CDATA[10740]]></ogc:Literal>
								<ogc:Literal><![CDATA[10741]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFD37F</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>half verharde weg</Name>
					<Title>half verharde weg</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10721]]></ogc:Literal>
								<ogc:Literal><![CDATA[10720]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#B3B300</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>hoofdweg</Name>
					<Title>hoofdweg</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10302]]></ogc:Literal>
								<ogc:Literal><![CDATA[10300]]></ogc:Literal>
								<ogc:Literal><![CDATA[10401]]></ogc:Literal>
								<ogc:Literal><![CDATA[10310]]></ogc:Literal>
								<ogc:Literal><![CDATA[10311]]></ogc:Literal>
								<ogc:Literal><![CDATA[10312]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#E60000</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>lokale weg</Name>
					<Title>lokale weg</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10502]]></ogc:Literal>
								<ogc:Literal><![CDATA[10500]]></ogc:Literal>
								<ogc:Literal><![CDATA[10501]]></ogc:Literal>
								<ogc:Literal><![CDATA[10510]]></ogc:Literal>
								<ogc:Literal><![CDATA[10511]]></ogc:Literal>
								<ogc:Literal><![CDATA[10512]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFFF00</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>onverharde weg</Name>
					<Title>onverharde weg</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10732]]></ogc:Literal>
								<ogc:Literal><![CDATA[10730]]></ogc:Literal>
								<ogc:Literal><![CDATA[10731]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#9C9C9C</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>overige weg</Name>
					<Title>overige weg</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10790]]></ogc:Literal>
								<ogc:Literal><![CDATA[10700]]></ogc:Literal>
								<ogc:Literal><![CDATA[10701]]></ogc:Literal>
								<ogc:Literal><![CDATA[10702]]></ogc:Literal>
								<ogc:Literal><![CDATA[10710]]></ogc:Literal>
								<ogc:Literal><![CDATA[10711]]></ogc:Literal>
								<ogc:Literal><![CDATA[10712]]></ogc:Literal>
								<ogc:Literal><![CDATA[10791]]></ogc:Literal>
								<ogc:Literal><![CDATA[10792]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFFFFF</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>parkeerplaats</Name>
					<Title>parkeerplaats</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10781]]></ogc:Literal>
								<ogc:Literal><![CDATA[10780]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFFFFF</CssParameter>
						</Fill>
						<Stroke>
							<CssParameter name="stroke">#343434</CssParameter>
							<CssParameter name="stroke-width">1</CssParameter>
						</Stroke>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>regionale weg</Name>
					<Title>regionale weg</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10402]]></ogc:Literal>
								<ogc:Literal><![CDATA[10400]]></ogc:Literal>
								<ogc:Literal><![CDATA[10301]]></ogc:Literal>
								<ogc:Literal><![CDATA[10410]]></ogc:Literal>
								<ogc:Literal><![CDATA[10411]]></ogc:Literal>
								<ogc:Literal><![CDATA[10412]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFAA00</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>rolbaan, platform</Name>
					<Title>rolbaan, platform</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10102]]></ogc:Literal>
								<ogc:Literal><![CDATA[10100]]></ogc:Literal>
								<ogc:Literal><![CDATA[10101]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#CCCCCC</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>startbaan, landingsbaan</Name>
					<Title>startbaan, landingsbaan</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10002]]></ogc:Literal>
								<ogc:Literal><![CDATA[10000]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#CCCCCC</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>straat</Name>
					<Title>straat</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10602]]></ogc:Literal>
								<ogc:Literal><![CDATA[10601]]></ogc:Literal>
								<ogc:Literal><![CDATA[10600]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFFFFF</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
				<Rule>
					<Name>voetgangersgebied</Name>
					<Title>voetgangersgebied</Title>
					<ogc:Filter>
						<ogc:PropertyIsEqualTo>
							<ogc:Function name="in">
								<ogc:PropertyName>visualisatiecode</ogc:PropertyName>
								<ogc:Literal><![CDATA[10760]]></ogc:Literal>
								<ogc:Literal><![CDATA[10750]]></ogc:Literal>
								<ogc:Literal><![CDATA[10751]]></ogc:Literal>
								<ogc:Literal><![CDATA[10752]]></ogc:Literal>
								<ogc:Literal><![CDATA[10761]]></ogc:Literal>
								<ogc:Literal><![CDATA[10762]]></ogc:Literal>
							</ogc:Function>
							<ogc:Literal>true</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<MaxScaleDenominator>40000</MaxScaleDenominator>
					<PolygonSymbolizer>
						<Fill>
							<CssParameter name="fill">#FFA77F</CssParameter>
						</Fill>
					</PolygonSymbolizer>
				</Rule>
			</FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
