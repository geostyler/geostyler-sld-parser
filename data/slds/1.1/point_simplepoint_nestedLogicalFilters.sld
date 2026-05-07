<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Simple Point Filter</se:Name>
    <UserStyle>
      <se:Name>Simple Point Filter</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Test</se:Name>
          <ogc:Filter xmlns="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>ID</ogc:PropertyName>
                  <ogc:Literal>1</ogc:Literal>
                </ogc:PropertyIsEqualTo>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>ID</ogc:PropertyName>
                  <ogc:Literal>2</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
              <ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>STREET</ogc:PropertyName>
                  <ogc:Literal>Main</ogc:Literal>
                </ogc:PropertyIsEqualTo>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>STREET</ogc:PropertyName>
                  <ogc:Literal>Time square</ogc:Literal>
                </ogc:PropertyIsEqualTo>
                <ogc:And>
                  <ogc:PropertyIsGreaterThanOrEqualTo>
                    <ogc:PropertyName>HOUSENO</ogc:PropertyName>
                    <ogc:Literal>1909</ogc:Literal>
                  </ogc:PropertyIsGreaterThanOrEqualTo>
                  <ogc:PropertyIsLessThanOrEqualTo>
                    <ogc:PropertyName>HOUSENO</ogc:PropertyName>
                    <ogc:Literal>19909</ogc:Literal>
                  </ogc:PropertyIsLessThanOrEqualTo>
                </ogc:And>
              </ogc:Or>
            </ogc:And>
          </ogc:Filter>
          <se:MinScaleDenominator>10000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>20000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#FF0000</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>6</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
