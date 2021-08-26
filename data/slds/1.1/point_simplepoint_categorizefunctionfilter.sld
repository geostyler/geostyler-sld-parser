<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Simple Point Categorize Function</se:Name>
    <UserStyle>
      <se:Name>Simple Point Categorize Function</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Small populated New Yorks</se:Name>
          <se:PointSymbolizer uom="http://www.opengeospatial.org/se/units/pixel">
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Function name="Categorize">
                      <ogc:PropertyName>TEST_PROPERTY</ogc:PropertyName>
                      <ogc:Literal>10</ogc:Literal>
                      <ogc:PropertyName>TEST_PROPERTY</ogc:PropertyName>
                      <ogc:Literal>6</ogc:Literal>
                      <ogc:Literal>2500</ogc:Literal>
                      <ogc:Literal>1</ogc:Literal>
                    </ogc:Function>
                  </se:SvgParameter>
                </se:Fill>
              </se:Mark>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
